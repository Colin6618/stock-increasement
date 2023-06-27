let valueExceptions = [
  "--",
  "Lost",
  "not there",
  "Not applicable",
  "--------",
  "NA",
  "N/A",
  "Not found",
  "UNKOWN",
  "Not present",
  "unknown",
  "-----",
  "Invalid",
  "Missing",
  "-",
];

// exception: empty string, space string

console.log("Number.isNaN(), isNan(), Number(), Number.isNaN(), StringValue");
valueExceptions.forEach((v) => {
  console.log(Number.isNaN(v), isNaN(v), Number(v), Number.isNaN(Number(v)), v);
});
