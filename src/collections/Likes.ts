import { CollectionConfig } from "payload/types"

const Likes: CollectionConfig = {
  slug: "likes",
  admin: {
    group: "Social Media",
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
}

export default Likes  
