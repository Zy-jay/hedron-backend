import * as fs from "fs"
import csv from "csv-parser"
import { CollectionStats } from "../types/openSeaAPIData"
import { getCollectionSlug, getCollectionStats } from "./getOpenSeaData"
import { sleep } from "./sleep"
import { writeCsv } from "./writeCsv"

function getCollectionSlugAndStats() {
  const results: any[] = []
  let timeoutOn = false

  fs.createReadStream("./src/assets/csv/address.csv")
    .pipe(csv())
    .on("data", data => results.push(data.address))
    .on("end", async () => {
      for (let i = 0; i < results.length; i++) {
        try {
          console.log("Get SLUG ", i)
          const _response = await getCollectionSlug(results[i])
          console.log(
            "Slug: " +
              (Number(_response?.status) === 200 ? "OK" : _response?.status),
          )
          const slug =
            _response?.data.collection?.slug &&
            _response.data.collection != null
              ? _response.data.collection.slug
              : undefined
          const collectionStatsResponse = await getCollectionStats(slug)
          console.log(
            "Stats: " +
              (Number(collectionStatsResponse?.status) === 200
                ? "OK"
                : collectionStatsResponse?.status),
          )
          const collectionStats: CollectionStats = collectionStatsResponse?.data
            .stats
            ? collectionStatsResponse.data.stats
            : {}

          if (_response?.status != 200 && !timeoutOn) {
            console.log("No Slug ID: ", i, "Contract: " + results[i])
            await sleep(2000)
            i--
            timeoutOn = true
            // await delay(i)
          } else if (
            _response?.status == 200 &&
            collectionStatsResponse?.status != 200 &&
            collectionStatsResponse?.status != 404 &&
            !timeoutOn
          ) {
            console.log(
              "No Stats ID: ",
              i,
              "Slug: " + slug,
              "Contract: " + results[i],
              collectionStatsResponse?.status,
            )
            timeoutOn = true
            await sleep(1000)
            i--
            timeoutOn = true
          } else {
            timeoutOn = false
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
                seven_day_average_price:
                  collectionStats.seven_day_average_price,
                seven_day_difference: collectionStats.seven_day_difference,
                thirty_day_volume: collectionStats.thirty_day_volume,
                thirty_day_change: collectionStats.thirty_day_change,
                thirty_day_sales: collectionStats.thirty_day_sales,
                thirty_day_average_price:
                  collectionStats.thirty_day_average_price,
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
            ]
            await writeCsv(records)
          }
        } catch (err) {
          console.log(err)
          return
        }
      }
    })
}
getCollectionSlugAndStats()
