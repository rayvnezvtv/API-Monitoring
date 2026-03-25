const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const monitoringRoutes = require("./routes/monitoring.routes");
const { getCheckedAt } = require("./utils/time");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", monitoringRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    status: 404,
    checked_at: getCheckedAt(),
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: error.message || "Internal Server Error",
    status: 500,
    checked_at: getCheckedAt(),
  });
});

module.exports = app;