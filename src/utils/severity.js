function getSeverity(percent) {
  if (percent > 90) return "CRITICAL";
  if (percent > 60) return "HIGH";
  if (percent > 30) return "LOW";
  return null;
}

module.exports = { getSeverity };
