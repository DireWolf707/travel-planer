import { CollectionConfig } from "payload/types"
import { isAnyone, isAdminOrSelf, isAuthenticated } from "../access"

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
  access: {
    create: isAnyone,
    read: isAuthenticated,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
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
