import { CollectionConfig } from "payload/types"

const Follows: CollectionConfig = {
  slug: "follows",
  admin: {
    group: "Social Media",
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
    beforeChange: [({ data, }) => {
      if (data.to === data.from) throw new Error("Can't follow yourself idiot")
    }]
  }
}

export default Follows
