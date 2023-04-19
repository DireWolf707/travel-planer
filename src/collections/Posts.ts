import { CollectionConfig } from "payload/types"
import { isAdmin, isAuthenticated } from "../access"
import FormData from "form-data"
import axios from "axios"
import { feedPipeline } from "../utils/pipelines"

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
      // @ts-ignore
      const feed = await req.payload.collections["follows"].Model.aggregate(feedPipeline(userId))
      res.status(200).json({ feed })
    }
  }]
}

export default Posts
