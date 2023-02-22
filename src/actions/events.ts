import Web3 from "web3"
// import utils from "ethers"
import { RPC_URLS } from "../constants/network"

const web3 = new Web3(RPC_URLS.ETHW)
const subscribedEvents: any = {}

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

const unsubscribeEvent = (eventName: string) => {
  subscribedEvents[eventName].unsubscribe(function (success: any) {
    if (success) {
      console.log("Successfully unsubscribed!")
    }
  })
}

const subscription = web3.eth
  .subscribe("newBlockHeaders", function (error, result) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!error) {
      console.log(result)

      return
    }

    console.error(error)
  })
  .on("connected", function (subscriptionId) {
    console.log(subscriptionId)
  })
  .on("data", function (blockHeader) {
    console.log(blockHeader)
  })
  .on("error", console.error)

// unsubscribes the subscription
// subscription.unsubscribe(function (error, success) {
//   if (success) {
//     console.log("Successfully unsubscribed!")
//   }
// })

export default module.exports = {
  subscription,
  unsubscribeEvent,
}
