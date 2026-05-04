const loadHar = require("./loadHar");
const analyzeHar = require("./analyzeHar");

const fileName = process.argv[2];

if (!fileName) {
  console.log("❌ Please provide HAR file name (e.g., sample.har)");
  process.exit(1);
}

try {
  const harData = loadHar(fileName);
  const result = analyzeHar(harData);

  console.log("\n📊 HAR Analysis");
  console.log("Total Requests:", result.totalRequests);
  console.log("Total Time:", result.totalTime, "ms");

  console.log("\n🐢 Slow Requests (>1s):");
  result.slowRequests.forEach((req) => {
    console.log(`${req.method} ${req.url} - ${req.time}ms`);
  });
} catch (err) {
  console.error(err.message);
}
