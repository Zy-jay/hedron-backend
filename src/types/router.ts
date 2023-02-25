import Router from "express"
import ApiController from "../actions/ApiController"

const router = new (Router as any)()

router.get("/loans", ApiController.getLoans)
router.get("/loans/:id")
router.get("/liquidates", ApiController.getLoansLiquidete)
router.get("/loans_liquidate/:id")
router.get("/loans_fair", ApiController.getLoansFair)
router.get("/loans_fair/:id")
router.get("/liquidates_fair", ApiController.getLoansLiquideteFair)
router.get("/loans_liquidate_fair/:id")

export default router
