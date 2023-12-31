import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "url";
import statsTopStock from "../src/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test sample2, nil case
statsTopStock(
  path.join(__dirname, "../asset/sample2.csv"),
  function (err, topStock) {
    if (err) {
      console.log(err);
      return;
    }
    assert.equal(topStock.increasement, 0);
  }
);
