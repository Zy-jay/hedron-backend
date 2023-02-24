"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const ethers_1 = require("ethers");
const id = crypto_1.default.randomBytes(32).toString("hex");
const privateKey = "0x" + id;
console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);
const wallet = new ethers_1.Wallet(privateKey);
console.log("Address: " + wallet.address);
console.log("Add the above address to your .env file as WALLET_PRIVATE_KEY. e.g.");
console.log("WALLET_PRIVATE_KEY=" + privateKey);
