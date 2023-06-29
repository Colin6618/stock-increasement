import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "url";
import statsTopStock from "../src/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test values.csv
statsTopStock(
  path.join(__dirname, "../asset/values.csv"),
  function (err, topStock) {
    if (err) {
      console.log(err);
      return;
    }
    assert.equal(topStock.increasement, 850);
  }
);
