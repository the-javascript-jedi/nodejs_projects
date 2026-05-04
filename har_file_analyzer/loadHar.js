const fs = require("fs");
const path = require("path");

function loadHar(fileName) {
  const filePath = path.join(__dirname, "har_file", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File not found: ${filePath}`);
  }

  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

module.exports = loadHar;
