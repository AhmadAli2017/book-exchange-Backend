require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectdb.js");
const cors = require("cors");
const { color, log } = require("console-log-colors");
const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("public"));

app.use(cors());
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

//database Connection
connectDB();
app.listen(PORT, () => {
  log(color.cyan(" ******************************************** "));
  log(color.cyan(" *******                              ******* "));
  log(
    color.cyan(` *******   Server started at ${process.env.PORT}     ******* `)
  );
  log(color.cyan(" *******                              ******* "));
  log(color.cyan(" ******************************************** "));
});
