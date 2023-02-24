"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.DB_URL = exports.RPC_URLS = void 0;
require("dotenv").config();
exports.RPC_URLS = {
    ETHW: `https://mainnet.ethereumpow.org`,
    ETHF: `https://rpc.etherfair.org`,
};
exports.DB_URL = "mongodb+srv://public:hex_public@hexcluster.gzy18nw.mongodb.net/?retryWrites=true&w=majority";
exports.PORT = process.env.PORT;
