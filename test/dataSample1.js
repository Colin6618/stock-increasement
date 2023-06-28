import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "url";
import statsTopStock from "../src/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test sample1
statsTopStock(
  path.join(__dirname, "../asset/sample1.csv"),
  function (topStock) {
    // console.log(topStock);
    assert.equal(topStock.increasement, 5832);
  }
);
