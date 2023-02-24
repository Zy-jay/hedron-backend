"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Loan_1 = __importDefault(require("../types/Loan"));
const LoanLiquidate_1 = __importDefault(require("../types/LoanLiquidate"));
class ApiController {
    //   async create(req, res) {
    //     try {
    //     } catch (e) {
    //       console.log(err)
    //     }
    //   }
    async getLoans(req, res) {
        try {
            const loans = await Loan_1.default.find();
            return res.json(loans);
        }
        catch (e) {
            res.status(500).json(e);
        }
    }
    async getLoansLiquidete(req, res) {
        try {
            const loansLiquidations = await LoanLiquidate_1.default.find();
            return res.json(loansLiquidations);
        }
        catch (e) {
            res.status(500).json(e);
        }
    }
}
exports.default = new ApiController();
