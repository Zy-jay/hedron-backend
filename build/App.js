"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// eslint-disable-next-line import/default
const mongoose_1 = __importDefault(require("mongoose"));
const getActiveAuctions_1 = require("./actions/getActiveAuctions");
const network_1 = require("./constants/network");
const Loan_1 = __importDefault(require("./types/Loan"));
const LoanLiquidate_1 = __importDefault(require("./types/LoanLiquidate"));
const getContracts_1 = require("./utils/getContracts");
const getProvider_1 = require("./utils/getProvider");
const sleep_1 = require("./utils/sleep");
// import LoanLiquidate from "./types/LoanLiquidate"
let lastBlockNumber = 0;
async function updateLoansLiquidate() {
    try {
        const hexCurrentDay = await (0, getActiveAuctions_1.getHexCurrentDay)();
        const loanLiquidateStart = await (0, getActiveAuctions_1.getLiquidationAuctions)();
        await (0, sleep_1.sleep)(3000);
        const hsiCount = await (0, getActiveAuctions_1.getHsiCount)();
        console.log("Vot", loanLiquidateStart.length, Number(hsiCount));
        if (loanLiquidateStart.length === Number(hsiCount)) {
            const loanLiquidateResults = await (0, getActiveAuctions_1.getLiquidationList)(loanLiquidateStart);
            const deletItem = await LoanLiquidate_1.default.deleteMany({ type: 1 });
            await (0, sleep_1.sleep)(2000, deletItem);
            await mongoose_1.default.connect(network_1.DB_URL);
            mongoose_1.default.set("strictQuery", true);
            loanLiquidateResults.map(async (item) => {
                try {
                    const loanLiquidate = new LoanLiquidate_1.default({
                        hsiAddress: item.liquidationList.hsiAddress.toString(),
                        hsiIndex: 0,
                        stakeShares: Number(item.share.stakeShares.toString()),
                        stakedDays: Number(item.share.stakedDays.toString()),
                        borrower: item.event.returnValues.borrower.toString(),
                        liquidationStart: Number(item.liquidationList.liquidationStart.toString()),
                        stakeId: Number(item.share.stakeId),
                        liquidator: item.liquidationList.liquidator.toString(),
                        progress: Number((((Number(item.share.stakedDays) -
                            (hexCurrentDay - Number(item.share.lockedDay))) /
                            Number(item.share.stakedDays) -
                            1) *
                            100).toFixed(2)),
                        currentBid: Number(item.liquidationList.bidAmount),
                        mintableHdrn: Number((Number(await item.share.stakeShares) *
                            (hexCurrentDay - Number(item.share.lockedDay))) /
                            10 ** 8).toFixed(1),
                        stakedHex: Number(item.share.stakedHearts),
                        hdrnBonus: 0,
                        liquidationId: Number(item.event.returnValues.liquidationId),
                        itemType: 1,
                        blockNumber: item.event.blockNumber,
                        lockedDay: Number(item.share.lockedDay),
                    });
                    await loanLiquidate.save();
                }
                catch (err) {
                    console.log(err);
                }
            });
            console.log(loanLiquidateResults.length);
            // loanLiquidateStart.map(item => {
            //   //    await LoanLiquidate.create({})
            // })
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function updateLoans() {
    try {
        const hexCurrentDay = await (0, getActiveAuctions_1.getHexCurrentDay)();
        const loans = await (0, getActiveAuctions_1.getAuctions)();
        await (0, sleep_1.sleep)(1000);
        // const hsiCount = await getHsiCount()
        //   console.log("Vot", loans[0].shareList)
        await (0, sleep_1.sleep)(2000);
        await mongoose_1.default.connect(network_1.DB_URL);
        mongoose_1.default.set("strictQuery", true);
        loans.map(async (item) => {
            try {
                await item;
                await Loan_1.default.deleteMany({ stakeId: Number(item.shareList.stake.stakeId) });
                const loan = new Loan_1.default({
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
                    progress: Number((((Number(item.shareList.stake.stakedDays) -
                        (hexCurrentDay - Number(item.shareList.stake.lockedDay))) /
                        Number(item.shareList.stake.stakedDays) -
                        1) *
                        100).toFixed(2)),
                    loanStart: 0,
                    startingBid: ((Number(item.shareList.stake.stakeShares) *
                        (Number(item.shareList.stake.stakedDays) -
                            (hexCurrentDay - Number(item.shareList.stake.lockedDay)))) /
                        10 ** 8).toFixed(1),
                    mintableHdrn: ((Number(item.shareList.stake.stakeShares) *
                        (Number(item.shareList.stake.lockedDay) - hexCurrentDay)) /
                        10 ** 8).toFixed(1),
                    stakedHex: Number(item.stake.stakedHearts),
                    hdrnBonus: item.shareList.launchBonus,
                    // liquidationId: Number(item.event.returnValues.liquidationId),
                    itemType: 0,
                    blockNumber: item.eventData.blockNumber,
                    lockedDay: item.shareList.stake.lockedDay,
                });
                await loan.save();
            }
            catch (err) {
                console.log(err);
            }
        });
        console.log("Loans lenght: ", loans.length, (await Loan_1.default.find()).length);
        // loanLiquidateStart.map(item => {
        //   //    await LoanLiquidate.create({})
        // })
    }
    catch (err) {
        console.log(err);
    }
}
async function App() {
    updateLoans();
    const hsiCount = await (0, getActiveAuctions_1.getHsiCount)();
    await (0, sleep_1.sleep)(1000);
    const loansLiquidation = await LoanLiquidate_1.default.find();
    await (0, sleep_1.sleep)(1000);
    console.log(loansLiquidation.length, Number(hsiCount), loansLiquidation.length != Number(hsiCount));
    if (loansLiquidation.length !== Number(hsiCount)) {
        await updateLoansLiquidate();
        const loansLiquidation = await LoanLiquidate_1.default.find();
        await (0, sleep_1.sleep)(500);
        console.log("loansLiquidation: ", loansLiquidation.length);
    }
    else {
        LoanLiquidate_1.default.deleteMany();
        await (0, sleep_1.sleep)(1000, "Liquqdations OK");
    }
    const hedronContractWeb3 = (0, getContracts_1.getHedronContract)();
    const subscribeOn = () => {
        try {
            getProvider_1.ethwEthersProvaider.on("block", async (blockNumber) => {
                console.log("new block " + blockNumber);
                lastBlockNumber = blockNumber;
                await hedronContractWeb3
                    .getPastEvents("LoanLiquidateExit", {
                    filter: {},
                    fromBlock: blockNumber,
                    toBlock: "latest",
                })
                    .then(events => {
                    if (events.length > 0) {
                        updateLoansLiquidate();
                    }
                });
                await hedronContractWeb3
                    .getPastEvents("LoanLiquidateStart", {
                    filter: {},
                    fromBlock: blockNumber,
                    toBlock: "latest",
                })
                    .then(async (events) => {
                    if (events.length > 0) {
                        await updateLoansLiquidate();
                        updateLoans();
                    }
                })
                    .catch(err => console.error(err));
            });
        }
        catch (err) {
            console.log(err);
        }
    };
    setInterval(async () => {
        const listenerCount = await getProvider_1.ethwEthersProvaider.listenerCount("block");
        // console.log("listenerCount:", listenerCount)
        const currentBlock = await getProvider_1.ethwEthersProvaider.getBlockNumber();
        if (lastBlockNumber + 1 < currentBlock) {
            console.log("removeAllListeners...");
            getProvider_1.ethwEthersProvaider.removeAllListeners();
        }
        if (!listenerCount && listenerCount === 0) {
            subscribeOn();
            console.log("Restart: subscribeOn", listenerCount);
        }
        else {
            console.log("listenerCount:", listenerCount);
        }
    }, 25000);
}
exports.App = App;
