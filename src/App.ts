// eslint-disable-next-line import/default
import { Interface } from "ethers"
import mongoose from "mongoose"
import HDRN_ABI from "./abis/hedron.json"
import {
  getAuctions,
  getHexCurrentDay,
  getHsiCount,
  getLiquidationAuctions,
  getLiquidationList,
} from "./actions/getActiveAuctions"
import { DB_URL } from "./constants/network"
import Loan from "./types/Loan"
import Loan_liquidate from "./types/LoanLiquidate"
import { getHedronContract } from "./utils/getContracts"
import { ethwEthersProvaider } from "./utils/getProvider"
import { sleep } from "./utils/sleep"
// import LoanLiquidate from "./types/LoanLiquidate"

let lastBlockNumber = 0

async function updateLoansLiquidate() {
  try {
    const hexCurrentDay = await getHexCurrentDay()
    const loanLiquidateStart = await getLiquidationAuctions()
    await sleep(5000)
    const hsiCount = await getHsiCount()
    console.log("Vot", loanLiquidateStart.length, Number(hsiCount))
    if (loanLiquidateStart.length === Number(hsiCount)) {
      await mongoose.connect(DB_URL)
      mongoose.set("strictQuery", true)
      const loanLiquidateResults = await getLiquidationList(loanLiquidateStart)
      const deletItem = await Loan_liquidate.deleteMany({ type: 1 })
      await sleep(4000, deletItem)
      loanLiquidateResults.map(async item => {
        try {
          const loanLiquidate = new Loan_liquidate({
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
            currentBidder: item.liquidationList.liquidator.toString(),
            currentBid: Number(item.liquidationList.bidAmount),
            mintableHdrn: Number(
              (Number(await item.share.stakeShares) *
                (hexCurrentDay - Number(item.share.lockedDay))) /
                10 ** 8,
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
    console.log(err)
  }
}

async function updateLoans() {
  try {
    const hexCurrentDay = await getHexCurrentDay()
    const loans = await getAuctions()
    await sleep(5000)
    // const hsiCount = await getHsiCount()
    //   console.log("Vot", loans[0].shareList)
    await mongoose.connect(DB_URL)
    mongoose.set("strictQuery", true)
    loans.map(async item => {
      try {
        await item
        await Loan.deleteMany({ stakeId: Number(item.shareList.stake.stakeId) })

        const loan = new Loan({
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
            10 ** 8
          ).toFixed(1),
          mintableHdrn: (
            (Number(item.shareList.stake.stakeShares) *
              (Number(item.shareList.stake.lockedDay) - hexCurrentDay)) /
            10 ** 8
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
        console.log(err)
      }
    })
    console.log("Loans lenght: ", loans.length, (await Loan.find()).length)
    // loanLiquidateStart.map(item => {
    //   //    await LoanLiquidate.create({})
    // })
  } catch (err) {
    console.log(err)
  }
}

async function checkLiquidations() {
  const hsiCount = await getHsiCount()
  await sleep(1000)
  const loansLiquidation = await Loan_liquidate.find()
  await sleep(1000)
  console.log(
    loansLiquidation.length,
    Number(hsiCount),
    loansLiquidation.length != Number(hsiCount),
  )
  if (loansLiquidation.length !== Number(hsiCount)) {
    await updateLoansLiquidate()
    const loansLiquidation = await Loan_liquidate.find()
    await sleep(500)
    console.log("loansLiquidation: ", loansLiquidation.length)
  } else {
    await sleep(1000, "Liquqdations OK")
  }
}

export async function App() {
  await checkLiquidations()
  await sleep(5000)
  const hedronContractWeb3 = getHedronContract()
  await updateLoans()
  const subscribeOn = () => {
    try {
      ethwEthersProvaider.on("block", async (blockNumber: number) => {
        console.log("new block " + blockNumber)
        lastBlockNumber = blockNumber
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
                console.log("NEW EVENT - Bid:", events[i].returnValues)
                const transaction: any =
                  await ethwEthersProvaider.getTransaction(
                    events[i].transactionHash,
                  )
                const iface = new Interface(HDRN_ABI)
                const data = transaction.data.toString()
                const txData = iface.parseTransaction({ data })
                console.log(Number(txData?.args[1]))
                const doc = await Loan_liquidate.findOne({
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
          .getPastEvents("LoanLiquidateExit", {
            filter: {},
            fromBlock: blockNumber,
            toBlock: "latest",
          })
          .then(async events => {
            if (events.length > 0) {
              console.log("NEW EVENT - Exit:", events.length, events[0])
              for (let i = 0; i < events.length; i++) {
                await Loan_liquidate.deleteMany({
                  stakeId: Number(events[i].returnValues.stakeId),
                })
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
              console.log("NEW EVENT - Liquidation Start:")
              for (let i = 0; i < events.length; i++) {
                Loan.deleteMany({
                  stakeId: Number(events[i].returnValues.stakeId),
                })
              }
              await updateLoansLiquidate()
              updateLoans()
            }
          })
          .catch(err => console.error(err))
      })
    } catch (err) {
      console.log(err)
    }
  }

  setInterval(checkLiquidations, 380000)

  setInterval(async () => {
    const listenerCount = await ethwEthersProvaider.listenerCount("block")
    // console.log("listenerCount:", listenerCount)
    const currentBlock = await ethwEthersProvaider.getBlockNumber()
    if (lastBlockNumber + 1 < currentBlock) {
      console.log("removeAllListeners...")
      ethwEthersProvaider.removeAllListeners()
    }
    if (!listenerCount && listenerCount === 0) {
      subscribeOn()
      console.log("Restart: subscribeOn", listenerCount)
    } else {
      console.log("listenerCount:", listenerCount)
    }
  }, 40000)
}
