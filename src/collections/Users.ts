import { CollectionConfig } from "payload/types"
import { isAnyone, isAdminOrSelf, isAuthenticated } from "../access"
import { profilePipeline } from "../utils/pipelines"
import { Types } from "mongoose"

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
  endpoints: [
    {
      path: "/profile/:profileId",
      method: "get",
      handler: async (req, res, next) => {
        const userId = req.user?.id
        if (!userId) return next(new Error("not authenticated"))

        const { profileId } = req.params
        // @ts-ignore
        const [profile] = await req.payload.collections["users"].Model.aggregate(profilePipeline(Types.ObjectId(profileId), userId))
        const {
          docs: [isFollowed],
        } = await req.payload.find({
          collection: "follows",
          where: {
            from: userId,
            // @ts-ignore
            to: profileId,
          },
        })

        res.status(200).json({ profile: { ...profile, isFollowed: Boolean(isFollowed) } })
      },
    },
  ],
}

export default Users
