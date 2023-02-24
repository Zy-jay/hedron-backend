import path from "path"
import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import serverless from "serverless-http"
import { App } from "./src/App"
import { DB_URL, PORT } from "./src/constants/network"
import router from "./src/types/router"
// import router from "./src/types/router"

const server = express()
server.use(cors())
server.use(express.json())
// server.get("/", (req, res) => {
//   console.log(req.query)
//   res.status(200).json("Good!")
// })
server.use(bodyParser.json())
server.use("/.netlify/functions/server", router) // path must route to lambda
server.use("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./index.html")),
)
async function startApp() {
  await mongoose.connect(DB_URL)
  mongoose.set("strictQuery", true)
  try {
    server.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT))
    App()
  } catch (err) {
    console.log(err)
  }
}
startApp()

module.exports.handler = serverless(server)
