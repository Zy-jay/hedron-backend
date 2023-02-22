import Loan from "../types/Loan"
import Loan_liquidate from "../types/LoanLiquidate"

class ApiController {
  //   async create(req, res) {
  //     try {
  //     } catch (e) {
  //       console.log(err)
  //     }
  //   }
  async getLoans(req: any, res: any) {
    try {
      const loans = await Loan.find()
      return res.json(loans)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getLoansLiquidete(req: any, res: any) {
    try {
      const loansLiquidations = await Loan_liquidate.find()
      return res.json(loansLiquidations)
    } catch (e) {
      res.status(500).json(e)
    }
  }
}

export default new ApiController()
