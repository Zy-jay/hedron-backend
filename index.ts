import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import { App } from "./src/App"
import { AppFair } from "./src/AppEthFair"
import { DB_URL, PORT } from "./src/constants/network"
import router from "./src/types/router"
// import router from "./src/types/router"
// let appOn = false
// let appFairOn = false
const server = express()
server.use(cors())
server.use(express.json())
server.use("/api", router)
server.get("/", (req, res) => {
  console.log(req.query)
  res.status(200).json("Good!")
})
async function startApp() {
  try {
    await mongoose.connect(DB_URL)
    mongoose.set("strictQuery", true)

    server.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT))
    App()

    setTimeout(AppFair, 120000)
  } catch (err) {
    console.log("APP ERROR: ", err)
  }
}
startApp()
