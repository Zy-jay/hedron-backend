import axios from "axios"
require("dotenv").config()

const apiKey = process.env.OPEN_SEA_API_KEY
export const apiClient = axios.create({
  baseURL: "https://api.opensea.io/api/",
  headers: {
    "X-API-KEY": apiKey,
  },
})
