const os = require("os");
const si = require("systeminformation");
const { getCheckedAt } = require("../utils/time");

function round(value) {
  return Number(value.toFixed(2));
}

async function getHealthInfo() {
  return {
    status: "UP",
    hostname: os.hostname(),
    os: os.platform(),
    platform: os.release(),
    checked_at: getCheckedAt(),
  };
}

async function getCpuInfo() {
  const load = await si.currentLoad();

  return {
    total_usage_percent: round(load.currentLoad),
    logical_cores: load.cpus.length,
    physical_cores: load.cpus.length,
    checked_at: getCheckedAt(),
  };
}

async function getMemoryInfo() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;

  const totalGb = total / 1024 / 1024 / 1024;
  const usedGb = used / 1024 / 1024 / 1024;
  const freeGb = free / 1024 / 1024 / 1024;

  return {
    total_gb: round(totalGb),
    used_gb: round(usedGb),
    free_gb: round(freeGb),
    available_gb: round(freeGb),
    used_percent: round((used / total) * 100),
    checked_at: getCheckedAt(),
  };
}

async function getDiskInfo() {
  const disks = await si.fsSize();
  const disk = disks[0]; // disque principal

  const totalGb = disk.size / 1024 / 1024 / 1024;
  const usedGb = disk.used / 1024 / 1024 / 1024;
  const freeGb = (disk.size - disk.used) / 1024 / 1024 / 1024;

  return {
    total_gb: round(totalGb),
    used_gb: round(usedGb),
    free_gb: round(freeGb),
    used_percent: round(disk.use),
    checked_at: getCheckedAt(),
  };
}

async function getAllMetrics() {
  const [host_info, cpu_info, memory_info, disk_info] = await Promise.all([
    getHealthInfo(),
    getCpuInfo(),
    getMemoryInfo(),
    getDiskInfo(),
  ]);

  return {
    host_info,
    cpu_info,
    memory_info,
    disk_info,
  };
}

module.exports = {
  getHealthInfo,
  getCpuInfo,
  getMemoryInfo,
  getDiskInfo,
  getAllMetrics,
};
