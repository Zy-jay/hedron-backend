"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = void 0;
const ethers_1 = require("ethers");
const getWallet = () => {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (privateKey === undefined) {
        throw new Error("No private key found in .env");
    }
    return new ethers_1.Wallet(privateKey);
};
exports.getWallet = getWallet;
