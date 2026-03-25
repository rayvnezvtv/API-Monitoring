const axios = require("axios");
const env = require("../config/env");
const { getSeverity } = require("../utils/severity");
const { getIsoDate, getCheckedAt } = require("../utils/time");

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${env.monitoringBearerToken}`,
    "Content-Type": "application/json",
  };
}

async function createIncident(metricName, value, hostname) {
  const severity = getSeverity(value);

  if (!severity) {
    return null;
  }

  const payload = {
    title: `ALERTE ${metricName.toUpperCase()} — Utilisation à ${value}%`,
    description: `Le serveur ${hostname} a détecté une utilisation ${metricName} anormale de ${value}% à ${getCheckedAt()}.`,
    application_id: env.monitoringApplicationId,
    status: "OPEN",
    severity,
    start_date: getIsoDate(),
  };

  const response = await axios.post(
    `${env.monitoringApiBaseUrl}/api/v1/incidents`,
    payload,
    { headers: getAuthHeaders() }
  );

  return {
    id: response.data?.data?.id || response.data?.id || null,
    severity,
    message: "Incident created on monitoring platform",
    raw: response.data,
  };
}

async function getIncidents() {
  const response = await axios.get(
   `${env.monitoringApiBaseUrl}/api/v1/incidents`,
    { headers: getAuthHeaders() }
  );

  return response.data;
}

module.exports = {
  createIncident,
  getIncidents,
};