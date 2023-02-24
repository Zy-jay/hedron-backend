"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Loan = new mongoose_1.default.Schema({
    borrower: { type: String, required: false },
    stakeId: { type: Number, required: true },
    progress: { type: Number, required: true },
    stakedHex: { type: Number, required: true },
    stakedDays: { type: Number, required: true },
    stakeShares: { type: Number, required: true },
    hdrnBonus: { type: Number, required: true },
    mintableHdrn: { type: Number, required: true },
    startingBid: { type: Number, required: true },
    available: { type: Number, required: false },
    liquidationId: { type: Number, required: false },
    currentBidder: { type: String, required: false },
    hsiAddress: { type: String, required: true },
    hsiIndex: { type: Number, required: false },
    liquidationStart: { type: Number, required: false },
    loanStart: { type: Number, required: true },
    blockNumber: { type: Number, required: true },
    lockedDay: { type: Number, required: true },
});
exports.default = mongoose_1.default.model("Loan", Loan);
