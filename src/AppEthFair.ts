// eslint-disable-next-line import/default
import { Interface } from "ethers"
import mongoose from "mongoose"
import HDRN_ABI from "./abis/hedron.json"
import {
  getAuctionsFair,
  getHexCurrentDayFair,
  getHsiCountFair,
  getLiquidationAuctionsFair,
  getLiquidationListFair,
} from "./actions/getActiveAuctionsFair"
import { DB_URL } from "./constants/network"
import Loan_fair from "./types/LoanFair"
import Loan_liquidate_fair from "./types/LoanLiquidateFair"
import { getHedronContract } from "./utils/getContracts"
import { ethfEthersProvaider } from "./utils/getProvider"
import { sleep } from "./utils/sleep"
// import LoanLiquidate from "./types/LoanLiquidate"

let lastBlockNumber = 0

async function updateLoansLiquidate() {
  try {
    const hexCurrentDay = await getHexCurrentDayFair()
    const loanLiquidateStart = await getLiquidationAuctionsFair()
    await sleep(7000)
    const hsiCount = await getHsiCountFair()
    console.log(
      "ETHF loanLiquidateStart:",
      loanLiquidateStart.length,
      Number(hsiCount),
    )
    if (loanLiquidateStart.length === Number(hsiCount)) {
      const loanLiquidateResults = await getLiquidationListFair(
        loanLiquidateStart,
      )
      await mongoose.connect(DB_URL)
      mongoose.set("strictQuery", true)
      const deletItem = await Loan_liquidate_fair.deleteMany({ type: 1 })
      await sleep(2000, deletItem)

      loanLiquidateResults.map(async item => {
        try {
          const loanLiquidate = new Loan_liquidate_fair({
            hsiAddress: item.liquidationList.hsiAddress.toString(),
            hsiIndex: 0,
            stakeShares: Number(item.share.stakeShares.toString()),
            stakedDays: Number(item.share.stakedDays.toString()),
            borrower: item.event.returnValues.borrower.toString(),
            liquidationStart: Number(
              item.liquidationList.liquidationStart.toString(),
            ),
            stakeId: Number(item.share.stakeId),
            liquidator: item.liquidationList.liquidator.toString(),
            progress: Number(
              (
                ((Number(item.share.stakedDays) -
                  (hexCurrentDay - Number(item.share.lockedDay))) /
                  Number(item.share.stakedDays) -
                  1) *
                100
              ).toFixed(2),
            ),
            currentBid: Number(item.liquidationList.bidAmount),
            mintableHdrn: Number(
              (Number(await item.share.stakeShares) *
                (hexCurrentDay - Number(item.share.lockedDay))) /
                10 ** 9,
            ).toFixed(1),
            stakedHex: Number(item.share.stakedHearts),
            hdrnBonus: 0,
            liquidationId: Number(item.event.returnValues.liquidationId),
            itemType: 1,
            blockNumber: item.event.blockNumber,
            lockedDay: Number(item.share.lockedDay),
          })
          await loanLiquidate.save()
        } catch (err) {
          console.log(err)
        }
      })

      console.log(loanLiquidateResults.length)
      // loanLiquidateStart.map(item => {
      //   //    await LoanLiquidate.create({})
      // })
    }
  } catch (err) {
    console.log("ETHF:_6", err)
  }
}

async function updateLoans() {
  try {
    const hexCurrentDay = await getHexCurrentDayFair()
    const loans = await getAuctionsFair()
    await sleep(1000)
    // const hsiCount = await getHsiCount()
    //   console.log("Vot", loans[0].shareList)
    await sleep(2000)
    await mongoose.connect(DB_URL)
    mongoose.set("strictQuery", true)
    loans.map(async item => {
      try {
        await item
        await Loan_fair.deleteMany({
          stakeId: Number(item.shareList.stake.stakeId),
        })

        const loan = new Loan_fair({
          hsiAddress: item.hsiAddress.toString(),
          hsiIndex: 0,
          stakeShares: Number(item.shareList.stake.stakeShares.toString()),
          stakedDays: Number(item.shareList.stake.stakedDays.toString()),
          borrower: item.eventData.returnValues.borrower.toString(),
          // liquidationStart: Number(
          //   item.liquidationList.liquidationStart.toString(),
          // ),
          stakeId: Number(item.shareList.stake.stakeId),
          // liquidator: item.liquidationList.liquidator.toString(),
          progress: Number(
            (
              ((Number(item.shareList.stake.stakedDays) -
                (hexCurrentDay - Number(item.shareList.stake.lockedDay))) /
                Number(item.shareList.stake.stakedDays) -
                1) *
              100
            ).toFixed(2),
          ),
          loanStart: 0,
          startingBid: (
            (Number(item.shareList.stake.stakeShares) *
              (Number(item.shareList.stake.stakedDays) -
                (hexCurrentDay - Number(item.shareList.stake.lockedDay)))) /
            10 ** 9
          ).toFixed(1),
          mintableHdrn: (
            (Number(item.shareList.stake.stakeShares) *
              (Number(item.shareList.stake.lockedDay) - hexCurrentDay)) /
            10 ** 9
          ).toFixed(1),
          stakedHex: Number(item.stake.stakedHearts),
          hdrnBonus: item.shareList.launchBonus,
          // liquidationId: Number(item.event.returnValues.liquidationId),
          itemType: 0,
          blockNumber: item.eventData.blockNumber,
          lockedDay: item.shareList.stake.lockedDay,
        })
        await loan.save()
      } catch (err) {
        console.log("ETHF:_5", err)
      }
    })
    console.log(
      "ETHF Loans lenght: ",
      loans.length,
      (await Loan_fair.find()).length,
    )
    // loanLiquidateStart.map(item => {
    //   //    await LoanLiquidate.create({})
    // })
  } catch (err) {
    console.log("ETHF_4:", err)
  }
}

export async function AppFair() {
  await updateLoans()
  const hsiCount = await getHsiCountFair()
  await sleep(1000)
  const loansLiquidation = await Loan_liquidate_fair.find()
  await sleep(1000)
  console.log(
    "ETHF loans Liquidation:",
    loansLiquidation.length,
    Number(hsiCount),
    loansLiquidation.length != Number(hsiCount),
  )
  if (loansLiquidation.length !== Number(hsiCount)) {
    await updateLoansLiquidate()
    const loansLiquidation = await Loan_liquidate_fair.find()
    await sleep(2000)
    console.log("ETHF loansLiquidation: ", loansLiquidation.length)
  } else {
    await sleep(1000, "ETHF Liquqdations OK")
  }
  const hedronContractWeb3 = getHedronContract(true)

  const subscribeOn = () => {
    try {
      ethfEthersProvaider.on("block", async (blockNumber: number) => {
        console.log("ETHF new block " + blockNumber)
        lastBlockNumber = blockNumber
        await hedronContractWeb3
          .getPastEvents("LoanLiquidateExit", {
            filter: {},
            fromBlock: blockNumber,
            toBlock: "latest",
          })
          .then(async events => {
            if (events.length > 0) {
              console.log(
                "NEW EVENT ETHF - LoanLiquidateExit:",
                events.length,
                events[0].returnValues,
              )
              for (let i = 0; i < events.length; i++) {
                await Loan_liquidate_fair.deleteMany({
                  stakeId: events[i].returnValues.stakeId,
                })
              }
            }
          })
        await hedronContractWeb3
          .getPastEvents("LoanLiquidateBid", {
            filter: {},
            fromBlock: blockNumber,
            toBlock: "latest",
          })
          .then(async events => {
            if (events.length > 0) {
              // eslint-disable-next-line for-direction
              for (let i = 0; i < events.length; i++) {
                console.log(
                  "NEW ETHF EVENT - LoanLiquidateBid:",
                  events.lenght,
                  events[i].returnValues,
                )
                const transaction: any =
                  await ethfEthersProvaider.getTransaction(
                    events[i].transactionHash,
                  )
                const iface = new Interface(HDRN_ABI)
                const data = transaction.data.toString()
                const txData = iface.parseTransaction({ data })
                console.log(Number(txData?.args[1]))
                const doc = await Loan_liquidate_fair.findOne({
                  stakeId: events[i].returnValues.stakeId,
                })
                doc &&
                  ((doc.currentBid = Number(txData?.args[1])),
                  (doc.liquidator = transaction.from))

                await doc?.save()
                // Loan_liquidate.findOneAndUpdate({}, {})
              }
            }
          })

        await hedronContractWeb3
          .getPastEvents("LoanLiquidateStart", {
            filter: {},
            fromBlock: blockNumber,
            toBlock: "latest",
          })
          .then(async events => {
            if (events.length > 0) {
              Loan_fair.deleteMany({ stakeId: events[0].stakeId })
              await updateLoansLiquidate()
              updateLoans()
            }
          })
          .catch(err => console.error("ETHF_2:", err))
      })
    } catch (err) {
      console.log("ETHF_0:", err)
    }
  }

  setInterval(async () => {
    try {
      const listenerCount = await ethfEthersProvaider.listenerCount("block")
      // console.log("listenerCount:", listenerCount)
      const currentBlock = await ethfEthersProvaider.getBlockNumber()
      if (lastBlockNumber + 1 < currentBlock) {
        console.log("ETHF removeAllListeners...")
        ethfEthersProvaider.removeAllListeners()
      }
      if (!listenerCount && listenerCount === 0) {
        subscribeOn()
        console.log("ETHF Restart: subscribeOn", listenerCount)
      } else {
        console.log("ETHF listenerCount:", listenerCount)
      }
    } catch (err) {
      console.log("ETHF_1:", err)
    }
  }, 50000)
}
