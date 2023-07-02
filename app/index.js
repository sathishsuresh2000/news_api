const express = require('express');
const Routes = require("./routes");
const serverConfig = require("config").get("server");

const app = express();

app.use("/", new Routes());

app.listen(serverConfig.port, () => console.log(`App listening on port ${serverConfig.port}!`));