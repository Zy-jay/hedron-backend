import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import { App } from "./src/App"
import { DB_URL, PORT } from "./src/constants/network"
import router from "./src/types/router"
// import router from "./src/types/router"

const server = express()
server.use(cors())
server.use(express.json())
server.use("/api", router)
server.get("/", (req, res) => {
  console.log(req.query)
  res.status(200).json("Good!")
})
async function startApp() {
  await mongoose.connect(DB_URL)
  mongoose.set("strictQuery", true)
  try {
    server.listen(undefined, () =>
      console.log("SERVER STARTED ON PORT " + PORT),
    )
    App()
  } catch (err) {
    console.log(err)
  }
}
startApp()
