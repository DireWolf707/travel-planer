import "./dotenvConfig"
import express from "express"
import payload from "payload"
import planner from "./utils/planner"
import suggestion from "./utils/suggestion"

const app = express()

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin")
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })


  app.use(payload.authenticate)
  app.use(express.json({ limit: "10kb" }))
  app.post("/travel-planner", async (req, res) => {
    // @ts-ignore
    if (!req.user) return res.status(403).json("not authenticated")
    if (!["destination", "days", "budget", "familyMembers", "children", "currentLocation"].every((field) => field in req.body))
      return res.status(400).json("all required fields not in body")

    const resp = await planner(req.body)
    res.status(200).json(resp)
  })
  app.get("/travel-suggestion", async (req, res) => {
    // @ts-ignore
    const userId = req.user?.id
    if (!userId) return res.status(403).json("not authenticated")
    // @ts-ignore
    const last3LikedPost = await req.payload.collections["likes"].Model.find({ userId }, "postId -_id").sort({ createdAt: -1 }).limit(3).populate({ path: "postId", select: "tag -_id" })
    if (last3LikedPost.length < 3) return res.status(403).json("not enough likes")
    
    const last3LikedPostTags = last3LikedPost.map(({ postId }) => postId.tag)
    const resp = await suggestion(last3LikedPostTags)
    res.status(200).json(resp)
  })

  app.listen(3000)
}

start()
