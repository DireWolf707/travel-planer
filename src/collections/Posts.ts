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
      if (file) {
        const formData = new FormData()
        formData.append("image", file.data)

        try {
          const resp = await axios.post(
            "https://api.imagga.com/v2/tags?limit=3&threshold=40.0",
            formData,
            { headers: { Authorization: process.env.IMAGGA_AUTHORIZATION_HEADER, "Content-Type": "multipart/form-data" } }
          )
          const tags = resp.data.result.tags.map((t) => ({ tag: t.tag.en }))
          data = { ...data, tags }
        } catch (err) {
          console.log(err.message)
          throw new Error("something went wrong!")
        }
      }

      return data
    }],
  },
}

export default Posts
