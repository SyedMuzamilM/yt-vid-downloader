const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/**
 * Import the routes
 */
const indexRouter = require("./routes/index");
const downloadRouter = require("./routes/download");

/**
 * User the routes on the specific endpoints
 */
app.use("", indexRouter);
app.use("/download", downloadRouter);

/**
 * Listen of port
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listning on PORT ${PORT}`));

module.exports = app;
