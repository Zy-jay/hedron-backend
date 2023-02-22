// eslint-disable-next-line import/default
import mongoose from "mongoose"
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

async function updateLoansLiquidate() {
  try {
    const hexCurrentDay = await getHexCurrentDay()
    const loanLiquidateStart = await getLiquidationAuctions()
    await sleep(3000)
    const hsiCount = await getHsiCount()
    console.log("Vot", loanLiquidateStart.length, Number(hsiCount))
    if (loanLiquidateStart.length === Number(hsiCount)) {
      const loanLiquidateResults = await getLiquidationList(loanLiquidateStart)
      const deletItem = await Loan_liquidate.deleteMany({ type: 1 })
      await sleep(2000, deletItem)
      await mongoose.connect(DB_URL)
      mongoose.set("strictQuery", true)
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
    await sleep(1000)
    // const hsiCount = await getHsiCount()
    //   console.log("Vot", loans[0].shareList)
    await sleep(2000)
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

export async function App() {
  updateLoans()
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
    Loan_liquidate.deleteMany()
    await sleep(1000, "Liquqdations OK")
  }
  const hedronContractWeb3 = getHedronContract()

  const subscribeOn = () => {
    try {
      ethwEthersProvaider.on("block", async (blockNumber: number) => {
        console.log("new block " + blockNumber)
        await hedronContractWeb3
          .getPastEvents("LoanLiquidateExit", {
            filter: {},
            fromBlock: blockNumber,
            toBlock: "latest",
          })
          .then(events => {
            if (events.length > 0) {
              updateLoansLiquidate()
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

  setInterval(async () => {
    const listenerCount = await ethwEthersProvaider.listenerCount("block")
    // console.log("listenerCount:", listenerCount)
    if (!listenerCount && listenerCount === 0) {
      subscribeOn()
      console.log("Restart: subscribeOn", listenerCount)
    } else {
      console.log("listenerCount:", listenerCount)
    }
  }, 25000)
}
