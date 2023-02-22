import Router from "express"
import ApiController from "../actions/ApiController"

const router = new (Router as any)()

router.get("/loans", ApiController.getLoans)
router.get("/loans/:id")
router.get("/liquidates", ApiController.getLoansLiquidete)
router.get("/loans_liquidate/:id")

export default router
