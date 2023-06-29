import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "url";
import statsTopStock from "../src/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test sample4 is a modification of sample1
statsTopStock(
  path.join(__dirname, "../asset/sample4.csv"),
  function (err, topStock) {
    if (err) {
      console.log(err);
      return;
    }
    assert.equal(topStock.name, "IQZ");
    assert.equal(topStock.increasement, 655.79);
  }
);
