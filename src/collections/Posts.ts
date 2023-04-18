import { CollectionConfig } from "payload/types"
import { isAdmin, isAuthenticated } from "../access"
import FormData from "form-data"
import axios from "axios"

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Social Media",
  },
  access: {
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "userId",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      required: true,
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        }
      ],
      access: {
        create: () => false,
        read: () => true,
        update: () => false,
      }
    },
  ],
  hooks: {
    beforeChange: [async ({ data, req }) => {
      if (!isAdmin({ req })) data = { ...data, userId: req.user.id }

      const file = req?.files?.file
      if (!file) return data

      try {
        const formData = new FormData()
        formData.append("image", file.data)
        const resp = await axios.post("https://api.imagga.com/v2/tags?limit=3&threshold=40.0",
          formData,
          { headers: { Authorization: process.env.IMAGGA_AUTHORIZATION_HEADER } })
        const tags = resp.data.result.tags.map((t) => ({ tag: t.tag.en }))
        return { ...data, tags }
      } catch (err) {
        console.log(err.message)
        throw new Error("something went wrong!")
      }
    }],
  },
  endpoints: [{
    path: "/feed",
    method: "get",
    handler: async (req, res, next) => {
      const userId = req.user?.id
      if (!userId) return next(new Error("not authenticated"))

      const feed = await req.payload.collections["follows"].Model.aggregate([
        { $match: { from: userId } },
        { $project: { to: 1, _id: 0 } },
        {
          $lookup: {
            from: "posts",
            as: "posts",
            let: { requiredUser: "$to" },
            pipeline: [
              { $match: { $expr: { $eq: ["$userId", "$$requiredUser"] } } },
              { $project: { userId: 1, caption: 1, createdAt: 1, url: 1 } },
              {
                $lookup: {
                  from: "likes",
                  as: "likes",
                  let: { requiredPost: "$_id" },
                  pipeline: [
                    { $set: { _requiredPost: { $toString: "$$requiredPost" } } },
                    { $match: { $expr: { $eq: ["$postId", "$_requiredPost"] } } },
                  ]
                }
              },
              { $set: { totalLikes: { $size: "$likes" }, liked: { $in: [userId, "$likes.userId"] } } },
              { $unset: "likes" },
              {
                $lookup: {
                  from: "users",
                  as: "user",
                  let: { requiredUser: "$userId" },
                  pipeline: [
                    { $set: { _requiredUser: { $toObjectId: "$$requiredUser" } } },
                    { $match: { $expr: { $eq: ["$_id", "$_requiredUser"] } } },
                  ]
                }
              },
              { $unwind: "$user" },
              { $set: { username: "$user.username" } },
              { $unset: "user" },
            ]
          }
        },
        { $unset: "to" },
        { $unwind: "$posts" },
        { $replaceRoot: { newRoot: "$posts" } },
        { $sort: { createdAt: -1 } }
      ])

      res.status(200).json({ feed })
    }
  }]
}

export default Posts
