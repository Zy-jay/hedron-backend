import { getLiquidationAuctions } from "./getActiveAuctions"

export async function main() {
  const loansLiquidations = getLiquidationAuctions()
  console.log((await loansLiquidations).length)
}

main()
