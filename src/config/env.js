const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  appName: process.env.APP_NAME || "HealthCheck API",
  baseUrl: process.env.BASE_URL || "http://localhost:8000",

  monitoringApiBaseUrl: process.env.MONITORING_API_BASE_URL,
  monitoringEmail: process.env.MONITORING_EMAIL,
  monitoringPassword: process.env.MONITORING_PASSWORD,
  monitoringBearerToken: process.env.MONITORING_BEARER_TOKEN,
  monitoringApplicationId: process.env.MONITORING_APPLICATION_ID,
  monitoringApplicationName: process.env.MONITORING_APPLICATION_NAME,
  alertThreshold: Number(process.env.ALERT_THRESHOLD || 30),
};