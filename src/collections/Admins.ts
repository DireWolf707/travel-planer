import { CollectionConfig } from "payload/types"

const Admins: CollectionConfig = {
  slug: "admins",
  auth: {
    tokenExpiration: 12 * 60 * 60, // 12 hours
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    verify: false,
  },
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
}

export default Admins
