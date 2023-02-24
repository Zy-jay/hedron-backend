"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Loan_liquidate = new mongoose_1.default.Schema({
    borrower: { type: String, required: true },
    stakeId: { type: Number },
    progress: { type: Number, required: true },
    stakedHex: { type: Number, required: true },
    stakedDays: { type: Number, required: true },
    stakeShares: { type: Number, required: true },
    hdrnBonus: { type: Number, required: true },
    mintableHdrn: { type: Number, required: true },
    available: { type: Number, required: false },
    liquidationId: { type: Number, required: true },
    currentBidder: { type: String, required: false },
    currentBid: { type: Number, required: true },
    hsiAddress: { type: String, required: true },
    hsiIndex: { type: Number, required: true },
    liquidationStart: { type: Number, required: true },
    loanStart: { type: Boolean, required: false },
    liquidator: { type: String, required: true },
    itemType: { type: Number, required: true },
    blockNumber: { type: Number, required: true },
    lockedDay: { type: Number, required: true },
});
exports.default = mongoose_1.default.model("Loan_liquidate", Loan_liquidate);
