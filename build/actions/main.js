"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const getActiveAuctions_1 = require("./getActiveAuctions");
async function main() {
    const loansLiquidations = (0, getActiveAuctions_1.getLiquidationAuctions)();
    console.log((await loansLiquidations).length);
}
exports.main = main;
main();
