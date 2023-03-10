const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

const connectDB = require("./config/db");
connectDB();

// ----------------------------------
// Routes Import
// ----------------------------------
const takhmeenForm = require("./routes/takhmeenForm");
const hofDetails = require("./routes/hofDetails");
const receipts = require("./routes/receipts");

// ----------------------------------
// Express configuration
// ----------------------------------
const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "./client/public")));
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.get("*.js", function (req, res, next) {
    req.url = req.url + ".br";
    res.set("Content-Encoding", "br");
    res.set("Content-Type", "text/javascript");
    next();
  });
  app.get("*.css", function (req, res, next) {
    req.url = req.url + ".br";
    res.set("Content-Encoding", "br");
    res.set("Content-Type", "text/css");
    next();
  });
  app.use(express.static(path.join(__dirname, "./client/build")));
}

// ----------------------------------
// API Routes
// ----------------------------------
app.use("/api/v1/takhmeenform", takhmeenForm);
app.use("/api/v1/hof", hofDetails);
app.use("/api/v1/receipts", receipts);
app.get('*', function(req, res) {res.sendFile(path.join(__dirname + '/client/build/index.html')); });
// ----------------------------------
// Express server
// ----------------------------------
const PORT = process.env.PORT || 5000;

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
  });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
