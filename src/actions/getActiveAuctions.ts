import { ZERO_ADDRESS } from "../constants/addresses"
import {
  getHedronContract,
  getHexStakeContract,
  getHsiContract,
  getHsiContracts,
} from "../utils/getContracts"
import { ethwEthersProvaider } from "../utils/getProvider"
import { sleep } from "../utils/sleep"

export async function getLiquidationAuctions() {
  //   const [loans, setLoans] = useState<any[]>([])
  let loanLiquidateStart: any[] = []
  // let loansExit: any[] = []
  const currentBlock = await ethwEthersProvaider.getBlockNumber()
  const START_BLOCK = currentBlock - 60447
  const hedronContractWeb3 = getHedronContract()
  await hedronContractWeb3
    .getPastEvents("LoanLiquidateStart", {
      filter: {},
      fromBlock: START_BLOCK - 580000,
      toBlock: "latest",
    })
    .then(events => {
      loanLiquidateStart = events
    })
    .catch(err => console.error(err))

  console.log(loanLiquidateStart.length)
  await hedronContractWeb3
    .getPastEvents("LoanLiquidateExit", {
      filter: {},
      fromBlock: START_BLOCK - 580000,
      toBlock: "latest",
    })
    .then(events => {
      // loansExit = events
      // console.log(loanLiquidateStart);

      events.map((item: any) => {
        const filter = loanLiquidateStart.filter(
          itemStart =>
            itemStart.returnValues.stakeId !== item.returnValues.stakeId,
        )
        loanLiquidateStart = filter
      })
      console.log("Return", loanLiquidateStart.length)
      //   setLoans(loanLiquidateStart)
    })
    .catch(err => console.error(err))

  //   if(loanLiquidateStart.length === Number(hsiCount)){
  //   }
  return loanLiquidateStart
}

export async function getHsiCount(address?: string) {
  const hexStakeContract = getHexStakeContract()
  const hsiCount = await hexStakeContract.methods
    .hsiCount(address ? address : ZERO_ADDRESS)
    .call()
  return hsiCount
}

export async function getHexCurrentDay() {
  const hedronContractWeb3 = getHedronContract()
  const hexCurrentDay = await hedronContractWeb3.methods.currentDay().call()
  return hexCurrentDay
}

// export async function getCurrentBlockNumber() {
//     const hexCurrentDay = await hedronContractWeb3.methods.currentDay().call()
//     return hexCurrentDay
//   }

export async function getLiquidationList(loans: any[]) {
  const loanResult: any[] = []
  const hedronContract = getHedronContract()
  loans.map(async item => {
    const liquidationListCall = await hedronContract.methods
      .liquidationList(await item.returnValues.liquidationId)
      .call()
    //   console.log(liquidationList.hsiAddress)
    const hsiContract = getHsiContract(await liquidationListCall.hsiAddress)

    const shareCall = await hsiContract.methods.stakeDataFetch().call()
    const result = {
      event: await item,
      share: await shareCall,
      liquidationList: await liquidationListCall,
    }
    loanResult.push(result)
  })
  await sleep(7000)
  console.log("RES", loanResult.length)

  return loanResult
}

export async function getAuctions() {
  const loans: any[] = []
  const loansResult: any[] = []
  // let loansExit: any[] = []
  let hSIStart: any[] = []
  let loanStart: any[] = []
  const currentBlock = await ethwEthersProvaider.getBlockNumber()
  const START_BLOCK = currentBlock - 10000
  const hedronContract = getHedronContract()

  await hedronContract
    .getPastEvents("LoanStart", {
      filter: {},
      fromBlock: START_BLOCK - 960000,
      toBlock: "latest",
    })
    .then(events => {
      loanStart = events
    })
    .catch(err => console.error(err))
  await hedronContract
    .getPastEvents("LoanLiquidateStart", {
      filter: {},
      fromBlock: START_BLOCK,
      toBlock: "latest",
    })
    .then(events => {
      console.log(loanStart.length)

      events.map((itemExit: any) => {
        const filter = loanStart.filter(
          itemStart =>
            itemStart.returnValues.stakeId !== itemExit.returnValues.stakeId,
        )
        loanStart = filter
      })
      console.log(loanStart.length)
    })
    .catch(err => console.error(err))
  const hsiContract = getHexStakeContract()
  await hsiContract
    .getPastEvents("HSIStart", {
      filter: {},
      fromBlock: START_BLOCK - 999000,
      toBlock: "latest",
    })
    .then(async (events: any[]) => {
      hSIStart = events
    })
    .catch((err: any) => console.error(err))

  hSIStart.map(async _event => {
    try {
      const hsiContract = getHsiContracts(_event.returnValues.hsiAddress)
      const share = await hsiContract.methods.stakeDataFetch().call()
      _event.share = share
    } catch (err) {
      _event.share = undefined
    }
  })
  await sleep(5000, "Await....")
  console.log("Await....", hSIStart.length, loanStart.length)

  loanStart.map(async _event => {
    const filterHsiAddresses = hSIStart.filter(item => {
      if (
        item.share?.stakeId.toString() ===
        _event.returnValues.stakeId.toString()
      ) {
        return true
      } else {
        return false
      }
    })
    // console.log("filterHsiAddresses", filterHsiAddresses.length)
    const result = {
      eventData: _event,
      share: filterHsiAddresses[0]?.share,
      hsiAddress: filterHsiAddresses[0]?.returnValues.hsiAddress,
    }
    loans.push(result)
  })
  await sleep(5000)
  loanStart = loans.filter(item => item.hsiAddress !== undefined)
  loanStart = loanStart.sort(
    (a, b) =>
      Number(b.eventData.blockNumber.toString()) -
      Number(a.eventData.blockNumber.toString()),
  )

  await loanStart.map(async (_event: any) => {
    const shareList_ = await hedronContract.methods
      .shareList(_event.eventData.returnValues.stakeId)
      .call()

    const result = {
      eventData: _event.eventData,
      stake: _event.share,
      hsiAddress: _event.hsiAddress,
      shareList: shareList_,
    }
    loansResult.push(result)
  })
  await sleep(15000)
  loanStart = loansResult.filter(item => item.shareList.isLoaned === true)
  //   await sleep(1000)
  console.log("Loan Result", loanStart.length, loansResult.length)
  return loanStart
}
