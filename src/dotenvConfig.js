require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? "/etc/secrets/.env" : ".env",
})
