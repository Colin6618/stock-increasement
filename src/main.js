import fs from "fs";
import Papa from "papaparse";

/*
+---------------------+              
|  Load data chunks   |                         
+---------------------+              
           |                         
+----------|----------+              
| Clean and transform |              
+---------------------+              
           |                         
+----------|----------+              
| Calculate and update|              
+---------------------+              
           |                         
+----------|----------+              
|    Stream end       |              
+---------------------+   
*/

const stockMap = new Map();
let topStock = { increasement: 0, name: "" }; // 100 times the increasement value
let illegalDataCount = 0;
/**
 * Given a file, statistics the data to get a stock with largest absolute increasement.
 * @param {string} filePath |  path of the dataSet file
 * @param {function} callback | function(err, data)
 */
export default function statsTopStock(filePath, callback) {
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
      refreshTopStock();
      callback(null, getReadableResult());
    })
    .on("error", (err) => {
      callback(err);
    });
}
/**
 * Remove dirty data
 * @param {Object} data
 * @returns {Object|undefined}
 */
function ETL(data = {}) {
  if (
    data.Name &&
    data.Date &&
    data.Value &&
    !Number.isNaN(Number(data.Value))
  ) {
    // 1. Price value to be a Number.
    // 2. Date to be comparable.
    data.Date = new Date(data.Date).getTime();
    data.Value = Number(data.Value);
    return data;
  } else if (data.Name && data.Date) {
    // row with illegal Value
    ++illegalDataCount;
    return;
  }
}

/**
 * keep the rows of earliest date and latest date.
 * Store in stockMap, key is stock name. Value is an array in ascending order by date.
 * @param {Object} row | reflect each row of the dataset
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
  }
}

/**
 * Calculate Top Stock from stockMap
 */
function refreshTopStock() {
  for (let [name, stockArray] of stockMap) {
    if (stockArray.length === 2) {
      let increasement = stockArray[1].Value * 100 - stockArray[0].Value * 100;
      if (increasement > topStock.increasement) {
        topStock.increasement = increasement;
        topStock.name = name;
        topStock.meta = stockArray;
      }
    }
  }
}

/**
 *
 * @returns {Object} the topStock object
 */
function getReadableResult() {
  return {
    increasement: topStock.increasement / 100,
    name: topStock.name.replace(/[\n\t]/g, ""),
  };
}
