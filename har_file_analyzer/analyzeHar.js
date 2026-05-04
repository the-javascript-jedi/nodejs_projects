function analyzeHar(harData) {
  const entries = harData.log.entries;

  const summary = {
    totalRequests: entries.length,
    totalTime: 0,
    slowRequests: [],
  };

  entries.forEach((entry) => {
    summary.totalTime += entry.time;

    if (entry.time > 1000) {
      summary.slowRequests.push({
        url: entry.request.url,
        time: entry.time,
        method: entry.request.method,
        status: entry.response.status,
      });
    }
  });

  return summary;
}

module.exports = analyzeHar;
