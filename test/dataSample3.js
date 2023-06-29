import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "url";
import statsTopStock from "../src/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test sample3 is a reorder set of sample1
statsTopStock(
  path.join(__dirname, "../asset/sample3.csv"),
  function (err, topStock) {
    if (err) {
      console.log(err);
      return;
    }
    assert.equal(topStock.name, "DLV");
    assert.equal(topStock.increasement, 58.32);
  }
);
