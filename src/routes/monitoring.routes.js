const express = require("express");
const controller = require("../controllers/monitoring.controller");

const router = express.Router();

router.get("/health", controller.health);
router.get("/cpu", controller.cpu);
router.get("/memory", controller.memory);
router.get("/disk", controller.disk);
router.get("/all", controller.all);
router.get("/incidents", controller.incidents);

module.exports = router;