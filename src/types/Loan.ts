import mongoose from "mongoose"

const Loan = new mongoose.Schema({
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
})
export default mongoose.model("Loan", Loan)
