const app = require("./app");
const env = require("./config/env");

app.listen(env.port, "0.0.0.0", () => {
  console.log(`🚀 API démarrée sur http://localhost:${env.port}`);
  console.log(`📄 Swagger UI sur http://localhost:${env.port}/docs`);
});
