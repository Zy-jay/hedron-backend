"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const App_1 = require("./App");
const network_1 = require("./constants/network");
const router_1 = __importDefault(require("./types/router"));
// import router from "./src/types/router"
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.get("/", (req, res) => {
    console.log(req.query);
    res.status(200).json("Good!");
});
server.use(body_parser_1.default.json());
server.use("/.netlify/functions/server", router_1.default); // path must route to lambda
server.use("/", (req, res) => res.sendFile(path_1.default.join(__dirname, "./index.html")));
async function startApp() {
    await mongoose_1.default.connect(network_1.DB_URL);
    mongoose_1.default.set("strictQuery", true);
    try {
        server.listen(network_1.PORT, () => console.log("SERVER STARTED ON PORT " + network_1.PORT));
        (0, App_1.App)();
    }
    catch (err) {
        console.log(err);
    }
}
startApp();
module.exports.handler = (0, serverless_http_1.default)(server);
