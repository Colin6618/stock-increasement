import fs from "fs";
import Papa from "papaparse";

const stockMap = new Map();
let topStock = { increasement: 0, name: "" }; // 100 times the increasement data
let validDataCount = 0;
let inValidDataCount = 0;

/**
 *
 * @param {string} filePath
 */
export default function statsTopStock(filePath, cb) {
  const options = { header: true };

  fs.createReadStream(filePath)
    .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, options))
    .on("data", (data) => {
      let validData = ETL(data);
      if (validData) {
        handler(validData);
      }
    })
    .on("end", () => {
      console.log("Valid Items: ", validDataCount);
      console.log("Invalid Items: ", inValidDataCount);
      console.log("Total Items: ", validDataCount + inValidDataCount);
      console.log("===Data Loaded===");
      cb(topStock);
      // printTopStock(currentTop);
    });
}
/**
 * remove dirty data
 * @param {Object} data
 * @returns {Object|undefined}
 */
function ETL(data = {}) {
  if (data.Value && !Number.isNaN(Number(data.Value))) {
    // Value column is a number
    data.Date = new Date(data.Date).getTime();
    data.Value = Number(data.Value);
    ++validDataCount;
    return data;
  }
  if (data.Name && data.Date) {
    // row with illegal Value
    ++inValidDataCount;
    return;
  }
}

/**
 * keep the row with earliest date and with the latest date.
 * Key is stock name. Value is an array in ascending order by date.
 * @param {Object} row
 * @returns null
 */
function handler(row) {
  if (!stockMap.has(row.Name)) {
    stockMap.set(row.Name, [row]);
  } else {
    let stockRecords = stockMap.get(row.Name);
    stockRecords.push(row);
    stockRecords.sort((i, j) => i.Date - j.Date); // two or three items in ascending order
    if (stockRecords.length === 3) {
      // remove the item with date in the middle
      stockRecords.splice(1, 1);
    }
    refreshTopStock(stockRecords, row.Name);
  }
}

/**
 *
 * @param {Array} stockRecords | [record, record]
 * @param {String} name | top stock name
 */
function refreshTopStock(stockRecords, name) {
  if (stockRecords.length === 2) {
    // Has change in price
    let increasement =
      stockRecords[1].Value * 100 - stockRecords[0].Value * 100;
    if (increasement > topStock.increasement) {
      topStock.increasement = increasement;
      topStock.name = name;
    }
  }
}
