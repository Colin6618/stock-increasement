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
let validDataCount = 0;
let inValidDataCount = 0;

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
      // console.log(
      //   "Valid, Invalid and Total Recordings: ",
      //   validDataCount,
      //   inValidDataCount,
      //   validDataCount + inValidDataCount
      // );
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
    refreshTopStock(stockRecords, row.Name); // to compare with the top stock
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

function getReadableResult() {
  topStock.increasement /= 100;
  topStock.name = topStock.name.replace(/[\n\t]/g, "");
  return topStock;
}
