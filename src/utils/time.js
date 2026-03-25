function getCheckedAt() {
  return new Date().toUTCString();
}

function getIsoDate() {
  return new Date().toISOString().slice(0, 19);
}

module.exports = {
  getCheckedAt,
  getIsoDate,
};
