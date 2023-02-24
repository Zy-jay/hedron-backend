"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
// import utils from "ethers"
const network_1 = require("../constants/network");
const web3 = new web3_1.default(network_1.RPC_URLS.ETHW);
const subscribedEvents = {};
// const subscribeLogEvent = (
//   eventName: string,
//   contract?: any,
//   //   topicsHex: string,
// ) => {
//   if (!contract) {
//     const subscription = web3.eth
//       .subscribe("newBlockHeaders", function (error, result) {
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         if (!error) {
//           console.log(result)
//           return
//         }
//         console.error(error)
//       })
//       .on("connected", function (subscriptionId) {
//         console.log(subscriptionId)
//       })
//       .on("data", function (blockHeader) {
//         console.log(blockHeader)
//       })
//       .on("error", console.error)
//     subscribedEvents[eventName] = subscription
//   }
//   const subscription = web3.eth.subscribe(
//     "logs",
//     {
//       address: contract.options.address,
//     },
//     (error, result) => {
//       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//       if (!error) {
//         console.log(`New ${eventName}!`, result)
//       } else {
//         console.log(error)
//       }
//     },
//   )
// }
const unsubscribeEvent = (eventName) => {
    subscribedEvents[eventName].unsubscribe(function (success) {
        if (success) {
            console.log("Successfully unsubscribed!");
        }
    });
};
const subscription = web3.eth
    .subscribe("newBlockHeaders", function (error, result) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!error) {
        console.log(result);
        return;
    }
    console.error(error);
})
    .on("connected", function (subscriptionId) {
    console.log(subscriptionId);
})
    .on("data", function (blockHeader) {
    console.log(blockHeader);
})
    .on("error", console.error);
// unsubscribes the subscription
// subscription.unsubscribe(function (error, success) {
//   if (success) {
//     console.log("Successfully unsubscribed!")
//   }
// })
exports.default = module.exports = {
    subscription,
    unsubscribeEvent,
};
