"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const apiKey = process.env.OPEN_SEA_API_KEY;
exports.apiClient = axios_1.default.create({
    baseURL: "https://api.opensea.io/api/",
    headers: {
        "X-API-KEY": apiKey,
    },
});
