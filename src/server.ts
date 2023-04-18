import "./dotenvConfig"
import express from "express"
import payload from "payload"
import planner from "./utils/planner"

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
    if (!req.user) return res.status(403).end()
    if (!["destination", "days", "budget", "familyMembers", "children", "currentLocation"].every((field) => field in req.body))
      return res.status(400).end()

    const resp = await planner(req.body)
    res.status(200).json(resp)
  })

  app.listen(3000)
}

start()
