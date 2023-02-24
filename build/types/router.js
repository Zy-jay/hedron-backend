"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiController_1 = __importDefault(require("../actions/ApiController"));
const router = new express_1.default();
router.get("/loans", ApiController_1.default.getLoans);
router.get("/loans/:id");
router.get("/liquidates", ApiController_1.default.getLoansLiquidete);
router.get("/loans_liquidate/:id");
exports.default = router;
