import fs from "fs";
import Papa from "papaparse";

// TODO:
// Search the first recording and the last recording, calculate the increasement. Group by name. Orderby increasement. limit 1.
// 1. load data
// 2. core function
// 3. possible optimizations:
//    core func impl
//    engineering: steam, batching, datasource, measure performance.

const stockMap = new Map();
const currentTop = { increasement: 0 };
let validDataCount = 0;
let inValidDataCount = 0;
const options = { header: true };
fs.createReadStream("./data/values.csv")
  .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, options))
  .on("data", (data) => {
    let validData = ETL(data);
    if (validData) {
      // console.log(validData);
      handler(validData);
    }
  })
  .on("end", () => {
    console.log("Valid Items: ", validDataCount);
    console.log("Invalid Items: ", inValidDataCount);
    console.log("Total Items: ", validDataCount + inValidDataCount);
    console.log("Top Stock: ", currentTop);
  });

/**
 * remove dirty data
 * @param {Object} data
 * @returns {Object|undefined}
 */
function ETL(data = {}) {
  if (data.Value && !Number.isNaN(Number(data.Value))) {
    data.Date = new Date(data.Date).getTime();
    data.Value = Number(data.Value);
    ++validDataCount;
    return data;
  } else if (data.Name && data.Date) {
    ++inValidDataCount;
  }
}

/**
 * keep the row with earliest date and with the latest date.
 * Key is stock name. Value is an array in ascending order by date.
 * @param {Object} data
 * @returns null
 */
function handler(data) {
  if (!stockMap.has(data.Name)) {
    stockMap.set(data.Name, [data]);
  } else {
    let stockRecords = stockMap.get(data.Name);
    stockRecords.push(data);
    stockRecords.sort((i, j) => i.Date - j.Date);
    stockRecords.length = 2;
    refreshTopStock(stockRecords, data.Name);
  }
}

/**
 *
 * @param {Array} stockRecords | [record, record]
 * @param {String} name | top stock name
 */
function refreshTopStock(stockRecords, name) {
  let increasement = stockRecords[1].Value - stockRecords[0].Value;
  if (increasement > currentTop.increasement) {
    currentTop.increasement = increasement;
    currentTop.name = name;
  }
}
