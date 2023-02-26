import { ethers } from "ethers"
import Web3 from "web3"
import HEDRON_ABI from "../abis/hedron.json"
import {
  HEDRON_ADDRESS,
  HEXS_STAKE_MANAGER_ADDRESS,
} from "../constants/addresses"
import { RPC_URLS } from "../constants/network"
import { ethfEthersProvaider, ethwEthersProvaider } from "./getProvider"

export function getHexStakeContract(fair?: boolean) {
  const provider = new Web3.providers.HttpProvider(
    fair ? RPC_URLS.ETHF : RPC_URLS.ETHW,
  )
  const web3 = new Web3(provider)
  web3.eth.handleRevert = true

  const hexStakeContract = new web3.eth.Contract(
    [
      {
        inputs: [
          { internalType: "address", name: "hexAddress", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "hsiTokenId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "hsiAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "staker",
            type: "address",
          },
        ],
        name: "HSIDetokenize",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "hsiAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "staker",
            type: "address",
          },
        ],
        name: "HSIEnd",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "hsiAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "staker",
            type: "address",
          },
        ],
        name: "HSIStart",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "hsiTokenId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "hsiAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "staker",
            type: "address",
          },
        ],
        name: "HSITokenize",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "hsiAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "oldStaker",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newStaker",
            type: "address",
          },
        ],
        name: "HSITransfer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address payable",
                name: "account",
                type: "address",
              },
              { internalType: "uint96", name: "value", type: "uint96" },
            ],
            indexed: false,
            internalType: "struct LibPart.Part[]",
            name: "royalties",
            type: "tuple[]",
          },
        ],
        name: "RoyaltiesSet",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getRaribleV2Royalties",
        outputs: [
          {
            components: [
              {
                internalType: "address payable",
                name: "account",
                type: "address",
              },
              { internalType: "uint96", name: "value", type: "uint96" },
            ],
            internalType: "struct LibPart.Part[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "hexStakeDetokenize",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "hexStakeEnd",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "length", type: "uint256" },
        ],
        name: "hexStakeStart",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "hexStakeTokenize",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "hsiCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "hsiLists",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "hsiToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "currentHolder", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
          { internalType: "address", name: "newHolder", type: "address" },
        ],
        name: "hsiTransfer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "holder", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
          {
            components: [
              {
                components: [
                  { internalType: "uint40", name: "stakeId", type: "uint40" },
                  {
                    internalType: "uint72",
                    name: "stakeShares",
                    type: "uint72",
                  },
                  { internalType: "uint16", name: "lockedDay", type: "uint16" },
                  {
                    internalType: "uint16",
                    name: "stakedDays",
                    type: "uint16",
                  },
                ],
                internalType: "struct HEXStakeMinimal",
                name: "_stake",
                type: "tuple",
              },
              { internalType: "uint256", name: "_mintedDays", type: "uint256" },
              {
                internalType: "uint256",
                name: "_launchBonus",
                type: "uint256",
              },
              { internalType: "uint256", name: "_loanStart", type: "uint256" },
              { internalType: "uint256", name: "_loanedDays", type: "uint256" },
              {
                internalType: "uint256",
                name: "_interestRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_paymentsMade",
                type: "uint256",
              },
              { internalType: "bool", name: "_isLoaned", type: "bool" },
            ],
            internalType: "struct ShareCache",
            name: "share",
            type: "tuple",
          },
        ],
        name: "hsiUpdate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "salePrice", type: "uint256" },
        ],
        name: "royaltyInfo",
        outputs: [
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint256", name: "royaltyAmount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "stakeCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
        ],
        name: "stakeLists",
        outputs: [
          {
            components: [
              { internalType: "uint40", name: "stakeId", type: "uint40" },
              { internalType: "uint72", name: "stakedHearts", type: "uint72" },
              { internalType: "uint72", name: "stakeShares", type: "uint72" },
              { internalType: "uint16", name: "lockedDay", type: "uint16" },
              { internalType: "uint16", name: "stakedDays", type: "uint16" },
              { internalType: "uint16", name: "unlockedDay", type: "uint16" },
              { internalType: "bool", name: "isAutoStake", type: "bool" },
            ],
            internalType: "struct HEXStake",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "tokenByIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "index", type: "uint256" },
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    HEXS_STAKE_MANAGER_ADDRESS,
  )

  return hexStakeContract
}

export function getHsiContract(address: string, fair?: boolean) {
  const provider = new Web3.providers.HttpProvider(
    fair ? RPC_URLS.ETHF : RPC_URLS.ETHW,
  )
  const web3 = new Web3(provider)
  web3.eth.handleRevert = true

  const hsiContract = new web3.eth.Contract(
    [
      {
        inputs: [
          { internalType: "uint256", name: "stakeLength", type: "uint256" },
        ],
        name: "create",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "destroy",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "goodAccounting",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "hexAddress", type: "address" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "share",
        outputs: [
          {
            components: [
              { internalType: "uint40", name: "stakeId", type: "uint40" },
              { internalType: "uint72", name: "stakeShares", type: "uint72" },
              { internalType: "uint16", name: "lockedDay", type: "uint16" },
              { internalType: "uint16", name: "stakedDays", type: "uint16" },
            ],
            internalType: "struct HEXStakeMinimal",
            name: "stake",
            type: "tuple",
          },
          { internalType: "uint16", name: "mintedDays", type: "uint16" },
          { internalType: "uint8", name: "launchBonus", type: "uint8" },
          { internalType: "uint16", name: "loanStart", type: "uint16" },
          { internalType: "uint16", name: "loanedDays", type: "uint16" },
          { internalType: "uint32", name: "interestRate", type: "uint32" },
          { internalType: "uint8", name: "paymentsMade", type: "uint8" },
          { internalType: "bool", name: "isLoaned", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "stakeDataFetch",
        outputs: [
          {
            components: [
              { internalType: "uint40", name: "stakeId", type: "uint40" },
              { internalType: "uint72", name: "stakedHearts", type: "uint72" },
              { internalType: "uint72", name: "stakeShares", type: "uint72" },
              { internalType: "uint16", name: "lockedDay", type: "uint16" },
              { internalType: "uint16", name: "stakedDays", type: "uint16" },
              { internalType: "uint16", name: "unlockedDay", type: "uint16" },
              { internalType: "bool", name: "isAutoStake", type: "bool" },
            ],
            internalType: "struct HEXStake",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: "uint40", name: "stakeId", type: "uint40" },
                  {
                    internalType: "uint72",
                    name: "stakeShares",
                    type: "uint72",
                  },
                  { internalType: "uint16", name: "lockedDay", type: "uint16" },
                  {
                    internalType: "uint16",
                    name: "stakedDays",
                    type: "uint16",
                  },
                ],
                internalType: "struct HEXStakeMinimal",
                name: "_stake",
                type: "tuple",
              },
              { internalType: "uint256", name: "_mintedDays", type: "uint256" },
              {
                internalType: "uint256",
                name: "_launchBonus",
                type: "uint256",
              },
              { internalType: "uint256", name: "_loanStart", type: "uint256" },
              { internalType: "uint256", name: "_loanedDays", type: "uint256" },
              {
                internalType: "uint256",
                name: "_interestRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_paymentsMade",
                type: "uint256",
              },
              { internalType: "bool", name: "_isLoaned", type: "bool" },
            ],
            internalType: "struct ShareCache",
            name: "_share",
            type: "tuple",
          },
        ],
        name: "update",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address,
  )

  return hsiContract
}

export function getHedronContract(fair?: boolean, ether?: boolean) {
  const etherContract = new ethers.Contract(
    HEDRON_ADDRESS,
    HEDRON_ABI,
    fair ? ethfEthersProvaider : ethwEthersProvaider,
  )
  const provider = new Web3.providers.HttpProvider(
    fair ? RPC_URLS.ETHF : RPC_URLS.ETHW,
  )
  const web3 = new Web3(provider)
  web3.eth.handleRevert = true

  const hedronContractWeb3 = new web3.eth.Contract(
    [
      {
        inputs: [
          { internalType: "address", name: "hexAddress", type: "address" },
          { internalType: "uint256", name: "hexLaunch", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "claimant",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
        ],
        name: "Claim",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
        ],
        name: "LoanEnd",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "liquidationId",
            type: "uint40",
          },
        ],
        name: "LoanLiquidateBid",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "liquidator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "liquidationId",
            type: "uint40",
          },
        ],
        name: "LoanLiquidateExit",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "liquidationId",
            type: "uint40",
          },
        ],
        name: "LoanLiquidateStart",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
        ],
        name: "LoanPayment",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
        ],
        name: "LoanStart",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "data",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint40",
            name: "stakeId",
            type: "uint40",
          },
        ],
        name: "Mint",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "borrower", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "calcLoanPayment",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "borrower", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "calcLoanPayoff",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
          {
            internalType: "address",
            name: "hsiStarterAddress",
            type: "address",
          },
        ],
        name: "claimInstanced",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "stakeIndex", type: "uint256" },
          { internalType: "uint40", name: "stakeId", type: "uint40" },
        ],
        name: "claimNative",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "currentDay",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "dailyDataList",
        outputs: [
          { internalType: "uint72", name: "dayMintedTotal", type: "uint72" },
          { internalType: "uint72", name: "dayLoanedTotal", type: "uint72" },
          { internalType: "uint72", name: "dayBurntTotal", type: "uint72" },
          { internalType: "uint32", name: "dayInterestRate", type: "uint32" },
          { internalType: "uint8", name: "dayMintMultiplier", type: "uint8" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          {
            internalType: "uint256",
            name: "subtractedValue",
            type: "uint256",
          },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "hsim",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "liquidationList",
        outputs: [
          {
            internalType: "uint256",
            name: "liquidationStart",
            type: "uint256",
          },
          { internalType: "address", name: "hsiAddress", type: "address" },
          { internalType: "uint96", name: "bidAmount", type: "uint96" },
          { internalType: "address", name: "liquidator", type: "address" },
          { internalType: "uint88", name: "endOffset", type: "uint88" },
          { internalType: "bool", name: "isActive", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "loanInstanced",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "loanLiquidate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "liquidationId", type: "uint256" },
          {
            internalType: "uint256",
            name: "liquidationBid",
            type: "uint256",
          },
        ],
        name: "loanLiquidateBid",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "uint256", name: "liquidationId", type: "uint256" },
        ],
        name: "loanLiquidateExit",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "loanPayment",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "loanPayoff",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "loanedSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "hsiIndex", type: "uint256" },
          { internalType: "address", name: "hsiAddress", type: "address" },
        ],
        name: "mintInstanced",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "stakeIndex", type: "uint256" },
          { internalType: "uint40", name: "stakeId", type: "uint40" },
        ],
        name: "mintNative",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "proofOfBenevolence",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "shareList",
        outputs: [
          {
            components: [
              { internalType: "uint40", name: "stakeId", type: "uint40" },
              { internalType: "uint72", name: "stakeShares", type: "uint72" },
              { internalType: "uint16", name: "lockedDay", type: "uint16" },
              { internalType: "uint16", name: "stakedDays", type: "uint16" },
            ],
            internalType: "struct HEXStakeMinimal",
            name: "stake",
            type: "tuple",
          },
          { internalType: "uint16", name: "mintedDays", type: "uint16" },
          { internalType: "uint8", name: "launchBonus", type: "uint8" },
          { internalType: "uint16", name: "loanStart", type: "uint16" },
          { internalType: "uint16", name: "loanedDays", type: "uint16" },
          { internalType: "uint32", name: "interestRate", type: "uint32" },
          { internalType: "uint8", name: "paymentsMade", type: "uint8" },
          { internalType: "bool", name: "isLoaned", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    HEDRON_ADDRESS,
  )
  return ether ? etherContract : hedronContractWeb3
}

// export const getHsiContracts = (address: string) => {
//   const web3 = new Web3(RPC_URLS.ETHW)
//   return new web3.eth.Contract(
//     [
//       {
//         inputs: [
//           { internalType: "uint256", name: "stakeLength", type: "uint256" },
//         ],
//         name: "create",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//       {
//         inputs: [],
//         name: "destroy",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//       {
//         inputs: [],
//         name: "goodAccounting",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//       {
//         inputs: [
//           { internalType: "address", name: "hexAddress", type: "address" },
//         ],
//         name: "initialize",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//       {
//         inputs: [],
//         name: "share",
//         outputs: [
//           {
//             components: [
//               { internalType: "uint40", name: "stakeId", type: "uint40" },
//               { internalType: "uint72", name: "stakeShares", type: "uint72" },
//               { internalType: "uint16", name: "lockedDay", type: "uint16" },
//               { internalType: "uint16", name: "stakedDays", type: "uint16" },
//             ],
//             internalType: "struct HEXStakeMinimal",
//             name: "stake",
//             type: "tuple",
//           },
//           { internalType: "uint16", name: "mintedDays", type: "uint16" },
//           { internalType: "uint8", name: "launchBonus", type: "uint8" },
//           { internalType: "uint16", name: "loanStart", type: "uint16" },
//           { internalType: "uint16", name: "loanedDays", type: "uint16" },
//           { internalType: "uint32", name: "interestRate", type: "uint32" },
//           { internalType: "uint8", name: "paymentsMade", type: "uint8" },
//           { internalType: "bool", name: "isLoaned", type: "bool" },
//         ],
//         stateMutability: "view",
//         type: "function",
//       },
//       {
//         inputs: [],
//         name: "stakeDataFetch",
//         outputs: [
//           {
//             components: [
//               { internalType: "uint40", name: "stakeId", type: "uint40" },
//               { internalType: "uint72", name: "stakedHearts", type: "uint72" },
//               { internalType: "uint72", name: "stakeShares", type: "uint72" },
//               { internalType: "uint16", name: "lockedDay", type: "uint16" },
//               { internalType: "uint16", name: "stakedDays", type: "uint16" },
//               { internalType: "uint16", name: "unlockedDay", type: "uint16" },
//               { internalType: "bool", name: "isAutoStake", type: "bool" },
//             ],
//             internalType: "struct HEXStake",
//             name: "",
//             type: "tuple",
//           },
//         ],
//         stateMutability: "view",
//         type: "function",
//       },
//       {
//         inputs: [
//           {
//             components: [
//               {
//                 components: [
//                   { internalType: "uint40", name: "stakeId", type: "uint40" },
//                   {
//                     internalType: "uint72",
//                     name: "stakeShares",
//                     type: "uint72",
//                   },
//                   { internalType: "uint16", name: "lockedDay", type: "uint16" },
//                   {
//                     internalType: "uint16",
//                     name: "stakedDays",
//                     type: "uint16",
//                   },
//                 ],
//                 internalType: "struct HEXStakeMinimal",
//                 name: "_stake",
//                 type: "tuple",
//               },
//               { internalType: "uint256", name: "_mintedDays", type: "uint256" },
//               {
//                 internalType: "uint256",
//                 name: "_launchBonus",
//                 type: "uint256",
//               },
//               { internalType: "uint256", name: "_loanStart", type: "uint256" },
//               { internalType: "uint256", name: "_loanedDays", type: "uint256" },
//               {
//                 internalType: "uint256",
//                 name: "_interestRate",
//                 type: "uint256",
//               },
//               {
//                 internalType: "uint256",
//                 name: "_paymentsMade",
//                 type: "uint256",
//               },
//               { internalType: "bool", name: "_isLoaned", type: "bool" },
//             ],
//             internalType: "struct ShareCache",
//             name: "_share",
//             type: "tuple",
//           },
//         ],
//         name: "update",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//     ],
//     address,
//   )
// }
