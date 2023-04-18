import { CollectionConfig } from "payload/types"
import { isAdmin, isAuthenticated } from "../access"

const Likes: CollectionConfig = {
  slug: "likes",
  admin: {
    group: "Social Media",
  },
  access: {
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "userId",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "postId",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [async ({ data, req }) => {
      if (!isAdmin({ req })) data = { userId: req.user.id, postId: data.postId }

      if (!data.postId) throw new Error("postId field not found")

      const like = await req.payload.collections["likes"].Model.findOne(data)
      if (like) throw new Error("Already liked!")

      return data
    }]
  },
  endpoints: [
    {
      path: "/unlike",
      method: "post",
      handler: [async (req, res, next) => {
        const userId = req.user?.id
        const postId = req.body?.postId

        if (!userId) return next(new Error("not authenticated"))
        if (!postId) return next(new Error("postId field not found"))

        await req.payload.collections["likes"].Model.deleteOne({ userId, postId })
        res.status(200).end()
      }]
    }
  ]
}

export default Likes  
