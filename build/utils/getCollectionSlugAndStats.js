"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const getOpenSeaData_1 = require("./getOpenSeaData");
const sleep_1 = require("./sleep");
const writeCsv_1 = require("./writeCsv");
function getCollectionSlugAndStats() {
    const results = [];
    let timeoutOn = false;
    fs.createReadStream("./src/assets/csv/address.csv")
        .pipe((0, csv_parser_1.default)())
        .on("data", data => results.push(data.address))
        .on("end", async () => {
        var _a;
        for (let i = 0; i < results.length; i++) {
            try {
                console.log("Get SLUG ", i);
                const _response = await (0, getOpenSeaData_1.getCollectionSlug)(results[i]);
                console.log("Slug: " +
                    (Number(_response === null || _response === void 0 ? void 0 : _response.status) === 200 ? "OK" : _response === null || _response === void 0 ? void 0 : _response.status));
                const slug = ((_a = _response === null || _response === void 0 ? void 0 : _response.data.collection) === null || _a === void 0 ? void 0 : _a.slug) &&
                    _response.data.collection != null
                    ? _response.data.collection.slug
                    : undefined;
                const collectionStatsResponse = await (0, getOpenSeaData_1.getCollectionStats)(slug);
                console.log("Stats: " +
                    (Number(collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.status) === 200
                        ? "OK"
                        : collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.status));
                const collectionStats = (collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.data.stats)
                    ? collectionStatsResponse.data.stats
                    : {};
                if ((_response === null || _response === void 0 ? void 0 : _response.status) != 200 && !timeoutOn) {
                    console.log("No Slug ID: ", i, "Contract: " + results[i]);
                    await (0, sleep_1.sleep)(2000);
                    i--;
                    timeoutOn = true;
                    // await delay(i)
                }
                else if ((_response === null || _response === void 0 ? void 0 : _response.status) == 200 &&
                    (collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.status) != 200 &&
                    (collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.status) != 404 &&
                    !timeoutOn) {
                    console.log("No Stats ID: ", i, "Slug: " + slug, "Contract: " + results[i], collectionStatsResponse === null || collectionStatsResponse === void 0 ? void 0 : collectionStatsResponse.status);
                    timeoutOn = true;
                    await (0, sleep_1.sleep)(1000);
                    i--;
                    timeoutOn = true;
                }
                else {
                    timeoutOn = false;
                    const records = [
                        {
                            id: i,
                            addres: results[i],
                            slug: slug ? slug : "null",
                            one_hour_volume: collectionStats.one_hour_volume,
                            one_hour_change: collectionStats.one_hour_change,
                            one_hour_sales: collectionStats.one_hour_sales,
                            one_hour_sales_change: collectionStats.one_hour_sales_change,
                            one_hour_average_price: collectionStats.one_hour_average_price,
                            one_hour_difference: collectionStats.one_hour_difference,
                            six_hour_volume: collectionStats.six_hour_volume,
                            six_hour_change: collectionStats.six_hour_change,
                            six_hour_sales: collectionStats.six_hour_sales,
                            six_hour_sales_change: collectionStats.six_hour_sales_change,
                            six_hour_average_price: collectionStats.six_hour_average_price,
                            six_hour_difference: collectionStats.six_hour_difference,
                            one_day_volume: collectionStats.one_day_volume,
                            one_day_change: collectionStats.one_day_change,
                            one_day_sales: collectionStats.one_day_sales,
                            one_day_sales_change: collectionStats.one_day_sales_change,
                            one_day_average_price: collectionStats.one_day_average_price,
                            one_day_difference: collectionStats.one_day_difference,
                            seven_day_volume: collectionStats.seven_day_volume,
                            seven_day_change: collectionStats.seven_day_change,
                            seven_day_sales: collectionStats.seven_day_sales,
                            seven_day_average_price: collectionStats.seven_day_average_price,
                            seven_day_difference: collectionStats.seven_day_difference,
                            thirty_day_volume: collectionStats.thirty_day_volume,
                            thirty_day_change: collectionStats.thirty_day_change,
                            thirty_day_sales: collectionStats.thirty_day_sales,
                            thirty_day_average_price: collectionStats.thirty_day_average_price,
                            thirty_day_difference: collectionStats.thirty_day_difference,
                            total_volume: collectionStats.total_volume,
                            total_sales: collectionStats.total_sales,
                            total_supply: collectionStats.total_supply,
                            count: collectionStats.count,
                            num_owners: collectionStats.num_owners,
                            average_price: collectionStats.average_price,
                            num_reports: collectionStats.num_reports,
                            market_cap: collectionStats.market_cap,
                            floor_price: collectionStats.floor_price,
                        },
                    ];
                    await (0, writeCsv_1.writeCsv)(records);
                }
            }
            catch (err) {
                console.log(err);
                return;
            }
        }
    });
}
getCollectionSlugAndStats();
