import { CollectionConfig } from "payload/types"
import { isAdmin, isAuthenticated } from "../access"

const Follows: CollectionConfig = {
  slug: "follows",
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
      name: "from",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "to",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [async ({ data, req }) => {
      if (!isAdmin({ req })) data = { to: data.to, from: req.user.id }

      if (!data.to) throw new Error("to field not found")
      if (data.to === data.from) throw new Error("Can't follow yourself idiot")

      const follow = await req.payload.collections["follows"].Model.findOne(data)
      if (follow) throw new Error("Already followed!")

      return data
    }]
  },
  endpoints: [
    {
      path: "/unfollow",
      method: "post",
      handler: [async (req, res, next) => {
        const to = req.body?.to
        const from = req.user?.id

        if (!from) return next(new Error("not authenticated"))
        if (!to) return next(new Error("to field not found"))

        await req.payload.collections["follows"].Model.deleteOne({ to, from })
        res.status(200).end()
      }]
    }
  ]
}

export default Follows
