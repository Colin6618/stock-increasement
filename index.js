import path from "path";
import statsTopStock from "./src/main.js";

// TODO:
// Search the first recording and the last recording, calculate the increasement. Group by name. Orderby increasement. limit 1.
// 1. load data
// 2. core function
// 3. possible optimizations:
//    core func impl
//    engineering: steam, batching, datasource, measure performance.

statsTopStock(path.resolve("./asset/values.csv"), printTopStock);

/**
 *
 * @param {Object} topStock | {name: 'stockName', increasement: Number}
 */
function printTopStock(topStock) {
  let msg = "";
  if (topStock.increasement > 0) {
    msg = `公司: ${topStock.name}, 股价增值: ${Number.parseFloat(
      topStock.increasement / 100
    ).toFixed(4)}`;
  } else {
    msg = "nil";
  }
  console.log(msg);
}
