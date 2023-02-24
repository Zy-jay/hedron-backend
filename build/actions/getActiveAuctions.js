"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuctions = exports.getLiquidationList = exports.getHexCurrentDay = exports.getHsiCount = exports.getLiquidationAuctions = void 0;
const addresses_1 = require("../constants/addresses");
const getContracts_1 = require("../utils/getContracts");
const getProvider_1 = require("../utils/getProvider");
const sleep_1 = require("../utils/sleep");
async function getLiquidationAuctions() {
    //   const [loans, setLoans] = useState<any[]>([])
    let loanLiquidateStart = [];
    // let loansExit: any[] = []
    const currentBlock = await getProvider_1.ethwEthersProvaider.getBlockNumber();
    const START_BLOCK = currentBlock - 60447;
    const hedronContractWeb3 = (0, getContracts_1.getHedronContract)();
    await hedronContractWeb3
        .getPastEvents("LoanLiquidateStart", {
        filter: {},
        fromBlock: START_BLOCK - 580000,
        toBlock: "latest",
    })
        .then(events => {
        loanLiquidateStart = events;
    })
        .catch(err => console.error(err));
    console.log(loanLiquidateStart.length);
    await hedronContractWeb3
        .getPastEvents("LoanLiquidateExit", {
        filter: {},
        fromBlock: START_BLOCK - 580000,
        toBlock: "latest",
    })
        .then(events => {
        // loansExit = events
        // console.log(loanLiquidateStart);
        events.map((item) => {
            const filter = loanLiquidateStart.filter(itemStart => itemStart.returnValues.stakeId !== item.returnValues.stakeId);
            loanLiquidateStart = filter;
        });
        console.log("Return", loanLiquidateStart.length);
        //   setLoans(loanLiquidateStart)
    })
        .catch(err => console.error(err));
    //   if(loanLiquidateStart.length === Number(hsiCount)){
    //   }
    return loanLiquidateStart;
}
exports.getLiquidationAuctions = getLiquidationAuctions;
async function getHsiCount(address) {
    const hexStakeContract = (0, getContracts_1.getHexStakeContract)();
    const hsiCount = await hexStakeContract.methods
        .hsiCount(address ? address : addresses_1.ZERO_ADDRESS)
        .call();
    return hsiCount;
}
exports.getHsiCount = getHsiCount;
async function getHexCurrentDay() {
    const hedronContractWeb3 = (0, getContracts_1.getHedronContract)();
    const hexCurrentDay = await hedronContractWeb3.methods.currentDay().call();
    return hexCurrentDay;
}
exports.getHexCurrentDay = getHexCurrentDay;
// export async function getCurrentBlockNumber() {
//     const hexCurrentDay = await hedronContractWeb3.methods.currentDay().call()
//     return hexCurrentDay
//   }
async function getLiquidationList(loans) {
    const loanResult = [];
    const hedronContract = (0, getContracts_1.getHedronContract)();
    loans.map(async (item) => {
        const liquidationListCall = await hedronContract.methods
            .liquidationList(await item.returnValues.liquidationId)
            .call();
        //   console.log(liquidationList.hsiAddress)
        const hsiContract = (0, getContracts_1.getHsiContract)(await liquidationListCall.hsiAddress);
        const shareCall = await hsiContract.methods.stakeDataFetch().call();
        const result = {
            event: await item,
            share: await shareCall,
            liquidationList: await liquidationListCall,
        };
        loanResult.push(result);
    });
    await (0, sleep_1.sleep)(7000);
    console.log("RES", loanResult.length);
    return loanResult;
}
exports.getLiquidationList = getLiquidationList;
async function getAuctions() {
    const loans = [];
    const loansResult = [];
    // let loansExit: any[] = []
    let hSIStart = [];
    let loanStart = [];
    const currentBlock = await getProvider_1.ethwEthersProvaider.getBlockNumber();
    const START_BLOCK = currentBlock - 10000;
    const hedronContract = (0, getContracts_1.getHedronContract)();
    await hedronContract
        .getPastEvents("LoanStart", {
        filter: {},
        fromBlock: START_BLOCK - 960000,
        toBlock: "latest",
    })
        .then(events => {
        loanStart = events;
    })
        .catch(err => console.error(err));
    await hedronContract
        .getPastEvents("LoanLiquidateStart", {
        filter: {},
        fromBlock: START_BLOCK,
        toBlock: "latest",
    })
        .then(events => {
        console.log(loanStart.length);
        events.map((itemExit) => {
            const filter = loanStart.filter(itemStart => itemStart.returnValues.stakeId !== itemExit.returnValues.stakeId);
            loanStart = filter;
        });
        console.log(loanStart.length);
    })
        .catch(err => console.error(err));
    const hsiContract = (0, getContracts_1.getHexStakeContract)();
    await hsiContract
        .getPastEvents("HSIStart", {
        filter: {},
        fromBlock: START_BLOCK - 999000,
        toBlock: "latest",
    })
        .then(async (events) => {
        hSIStart = events;
    })
        .catch((err) => console.error(err));
    hSIStart.map(async (_event) => {
        try {
            const hsiContract = (0, getContracts_1.getHsiContracts)(_event.returnValues.hsiAddress);
            const share = await hsiContract.methods.stakeDataFetch().call();
            _event.share = share;
        }
        catch (err) {
            _event.share = undefined;
        }
    });
    await (0, sleep_1.sleep)(5000, "Await....");
    console.log("Await....", hSIStart.length, loanStart.length);
    loanStart.map(async (_event) => {
        var _a, _b;
        const filterHsiAddresses = hSIStart.filter(item => {
            var _a;
            if (((_a = item.share) === null || _a === void 0 ? void 0 : _a.stakeId.toString()) ===
                _event.returnValues.stakeId.toString()) {
                return true;
            }
            else {
                return false;
            }
        });
        // console.log("filterHsiAddresses", filterHsiAddresses.length)
        const result = {
            eventData: _event,
            share: (_a = filterHsiAddresses[0]) === null || _a === void 0 ? void 0 : _a.share,
            hsiAddress: (_b = filterHsiAddresses[0]) === null || _b === void 0 ? void 0 : _b.returnValues.hsiAddress,
        };
        loans.push(result);
    });
    await (0, sleep_1.sleep)(5000);
    loanStart = loans.filter(item => item.hsiAddress !== undefined);
    loanStart = loanStart.sort((a, b) => Number(b.eventData.blockNumber.toString()) -
        Number(a.eventData.blockNumber.toString()));
    await loanStart.map(async (_event) => {
        const shareList_ = await hedronContract.methods
            .shareList(_event.eventData.returnValues.stakeId)
            .call();
        const result = {
            eventData: _event.eventData,
            stake: _event.share,
            hsiAddress: _event.hsiAddress,
            shareList: shareList_,
        };
        loansResult.push(result);
    });
    await (0, sleep_1.sleep)(15000);
    loanStart = loansResult.filter(item => item.shareList.isLoaned === true);
    //   await sleep(1000)
    console.log("Loan Result", loanStart.length, loansResult.length);
    return loanStart;
}
exports.getAuctions = getAuctions;
