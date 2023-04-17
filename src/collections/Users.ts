import { CollectionConfig } from "payload/types"

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 12 * 60 * 60, // 12 hours
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    verify: false,
  },
  admin: {
    useAsTitle: "username",
    group: "Social Media",
  },
  fields: [
    {
      name: "username",
      type: "text",
      unique: true,
      required: true,
      saveToJWT: true,
    },
  ],
}

export default Users
