import { buildConfig } from "payload/config"
import path from "path"
import { Users } from "./collections"

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [Users],
  csrf: [String(process.env.CLIENT_URL)],
  cors: [String(process.env.CLIENT_URL)],
  cookiePrefix: "auth",
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
})
