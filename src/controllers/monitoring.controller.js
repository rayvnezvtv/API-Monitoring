const systemService = require("../services/system.service");
const monitoringPlatformService = require("../services/monitoringPlatform.service");
const env = require("../config/env");
const { getCheckedAt } = require("../utils/time");

async function health(req, res, next) {
  try {
    const data = await systemService.getHealthInfo();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function cpu(req, res, next) {
  try {
    const data = await systemService.getCpuInfo();

    if (data.total_usage_percent > env.alertThreshold) {
      const host = await systemService.getHealthInfo();
      const incident = await monitoringPlatformService.createIncident(
        "CPU",
        data.total_usage_percent,
        host.hostname
      );

      return res.status(200).json({
        ...data,
        alert_triggered: true,
        incident: incident
          ? {
              id: incident.id,
              severity: incident.severity,
              message: incident.message,
            }
          : null,
      });
    }

    return res.status(200).json({
      ...data,
      alert_triggered: false,
    });
  } catch (error) {
    next(error);
  }
}

async function memory(req, res, next) {
  try {
    const data = await systemService.getMemoryInfo();

    if (data.used_percent > env.alertThreshold) {
      const host = await systemService.getHealthInfo();
      const incident = await monitoringPlatformService.createIncident(
        "RAM",
        data.used_percent,
        host.hostname
      );

      return res.status(200).json({
        ...data,
        alert_triggered: true,
        incident: incident
          ? {
              id: incident.id,
              severity: incident.severity,
              message: incident.message,
            }
          : null,
      });
    }

    return res.status(200).json({
      ...data,
      alert_triggered: false,
    });
  } catch (error) {
    next(error);
  }
}

async function disk(req, res, next) {
  try {
    const data = await systemService.getDiskInfo();

    if (data.used_percent > env.alertThreshold) {
      const host = await systemService.getHealthInfo();
      const incident = await monitoringPlatformService.createIncident(
        "DISK",
        data.used_percent,
        host.hostname
      );

      return res.status(200).json({
        ...data,
        alert_triggered: true,
        incident: incident
          ? {
              id: incident.id,
              severity: incident.severity,
              message: incident.message,
            }
          : null,
      });
    }

    return res.status(200).json({
      ...data,
      alert_triggered: false,
    });
  } catch (error) {
    next(error);
  }
}

async function all(req, res, next) {
  try {
    const data = await systemService.getAllMetrics();

    const hostname = data.host_info.hostname;

    for (const key of ["cpu_info", "memory_info", "disk_info"]) {
      const metric = data[key];
      const value =
        key === "cpu_info" ? metric.total_usage_percent : metric.used_percent;
      const label =
        key === "cpu_info" ? "CPU" : key === "memory_info" ? "RAM" : "DISK";

      if (value > env.alertThreshold) {
        const incident = await monitoringPlatformService.createIncident(
          label,
          value,
          hostname
        );
        metric.alert_triggered = true;
        metric.incident = incident
          ? {
              id: incident.id,
              severity: incident.severity,
              message: incident.message,
            }
          : null;
      } else {
        metric.alert_triggered = false;
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function incidents(req, res, next) {
  try {
    const data = await monitoringPlatformService.getIncidents();

    return res.status(200).json({
      incidents: data.data || data.incidents || data,
      total: data.total || (data.data ? data.data.length : 0),
      checked_at: getCheckedAt(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  health,
  cpu,
  memory,
  disk,
  all,
  incidents,
};