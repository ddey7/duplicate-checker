const serverless = require("serverless-http");
const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { duplicateCheckerRouter } = require("./module/routes/duplicate_checker.routes");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.send(200);
  }
  next();
});
app.use("/duplicate", duplicateCheckerRouter);

app.use((req, res, next) => {
  return res.status(400).json({
    message: "Permission Denied",
  });
});

module.exports.handler = serverless(app);
