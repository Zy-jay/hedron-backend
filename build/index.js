"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_1 = require("./src/App");
const network_1 = require("./src/constants/network");
const router_1 = __importDefault(require("./src/types/router"));
// import router from "./src/types/router"
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use("/api", router_1.default);
server.get("/", (req, res) => {
    console.log(req.query);
    res.status(200).json("Good!");
});
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
