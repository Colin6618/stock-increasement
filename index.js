import path from "path";
import statsTopStock from "./src/main.js";

console.time("statsTopStock");
statsTopStock(path.resolve("./asset/values.csv"), function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  printTopStock(data);
  console.timeEnd("statsTopStock"); // Print runtime duration in ms.
});

/**
 * print the stock name and the absolute increasement, or print 'nil'.
 * @param {Object} topStock | {name: 'stockName', increasement: Number}
 */
function printTopStock(topStock) {
  let msg = "";
  if (topStock.increasement > 0) {
    msg = `公司: ${topStock.name}, 股价增值: ${Number.parseFloat(
      topStock.increasement
    ).toFixed(4)}`;
  } else {
    msg = "nil";
  }
  console.log(msg);
}
