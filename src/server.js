const config = require("config");
const express = require("express");
const logger = require("morgan");
const uuid = require("uuid");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const startSocketServer = require("./socket/startSocketServer");
const mw = require("./middleware");
const cors = require("cors");
const db = require("./db");

const startHttpServer = async function () {
  const app = express();

  require("./middleware-wrapper");

  // add uuid to each request
  const assignId = function (req, res, next) {
    req.id = uuid.v4();
    next();
  };

  app.use(assignId);

  // setup logger
  logger.token("id", (req) => {
    return req.id;
  });

  app.use(logger(":id :remote-addr :method :url :status :response-time"));

  app.use('/health-check', (req, res) => {res.send('ok');});

  app.use(helmet({ frameguard: { action: "deny" } }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.enable("trust proxy");
  app.use(mw.attachCurrentUserToRequest);
  app.use(cors({
    // origins: ["http://localhost:8080", "http://localhost:8081", "http://localhost:8082"],
    origins: "*",
    optionsSuccessStatus: 200
  }));

  const router = express.Router();

  router.use("/auth", require("./routes/auth")());

  app.use("/api", router);

  const server = app.listen(config.get("PORT"));

  console.log(`server listening on port ${config.get("PORT")}`);

  return server;
};

startHttpServer()
  .then((server) => {
    startSocketServer(server, db);
  })
  .catch((e) => {
    console.log(e);
  });
