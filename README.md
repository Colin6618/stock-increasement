# stock-increasement

Tell the top stock from recordings of all stocks.

## Workflow

The dataset, located at asset/values.csv, consists of 10,000 unsorted entries. Some columns contain illegal values that cannot be treated as price data. These values need to be addressed before performing any calculations.

The primary workflow for the calculation is as follows:

1. Read the dataset using a file stream to avoid unexpected memory usage.
2. Clean and transform the data entries in each data chunk. In this case, we don't store any cleaned data temporarily in a database.
3. Calculate and store the current best-performing stock, which exhibits the largest increase in price. The result will be updated whenever more recent data is available.
4. A callback function will be invoked upon completion of the calculation.

## Development

Install the dependencies before run the main function. Use `npm start` or `node index.js` to run the calculation.

1. npm install
2. npm start

### Test

Several test cases are ready in the test folder. Use `npm test` or `node --test` to run all test cases. Excution duration is also printed as test results.

### Result

Typical runtime duration is around 73 ms for a dataset of 10k rows.

![SCR-20230628-s0q](https://github.com/Colin6618/stock-increasement/assets/3047309/8e598f22-d97b-4553-b034-c8bbaf75756f)

