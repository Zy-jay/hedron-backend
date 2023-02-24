"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethfEthersProvaider = exports.ethwEthersProvaider = exports.getRpcProvider = void 0;
const ethers_1 = require("ethers");
const network_1 = require("../constants/network");
function getRpcProvider(rpc) {
    const ethersJsonRpcProvider = new ethers_1.ethers.JsonRpcProvider(rpc);
    return ethersJsonRpcProvider;
}
exports.getRpcProvider = getRpcProvider;
exports.ethwEthersProvaider = getRpcProvider(network_1.RPC_URLS.ETHW);
exports.ethfEthersProvaider = getRpcProvider(network_1.RPC_URLS.ETHF);
