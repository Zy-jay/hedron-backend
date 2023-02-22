import { ethers } from "ethers"
import { RPC_URLS } from "../constants/network"

export function getRpcProvider(rpc: string) {
  const ethersJsonRpcProvider = new ethers.JsonRpcProvider(rpc)
  return ethersJsonRpcProvider
}

export const ethwEthersProvaider = getRpcProvider(RPC_URLS.ETHW)
export const ethfEthersProvaider = getRpcProvider(RPC_URLS.ETHF)
