import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import { App } from "./App"
import { AppFair } from "./AppEthFair"
import { DB_URL, PORT } from "./constants/network"
import router from "./types/router"
// import router from "./src/types/router"
let appOn = false
let appFairOn = false
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
    try {
      appOn = true
      App()
    } catch (err) {
      console.log(err)
      appOn = false
    }
    setTimeout(() => {
      try {
        appFairOn = true
        AppFair()
      } catch (err) {
        console.log(err)
        appFairOn = false
      }
    }, 60000)
  } catch (err) {
    console.log("ETHF ERR:", err)
  }
  setInterval(() => {
    console.log("Check App")
    if (!appOn) {
      appOn = true
      App()
    }
    if (!appFairOn) {
      appFairOn = true
      AppFair()
    }
  }, 60000)
}
startApp()
