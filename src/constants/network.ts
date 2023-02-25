require("dotenv").config()
export const RPC_URLS = {
  ETHW: `https://mainnet.ethereumpow.org`,
  ETHF: `https://rpc.etherfair.org`,
}
export const DB_URL =
  "mongodb+srv://public:hex_public@hexcluster.gzy18nw.mongodb.net/?retryWrites=true&w=majority"
export const PORT = process.env.PORT || 5001
