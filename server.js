const path = require("path");

const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");


const global = require("./middlewares/middlewaresError");
const ApiError = require("./utils/apiError");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const materialRoute = require("./routes/materialRoute");

dotenv.config({ path: "config.env" });
mongoose.connect(process.env.DB_URI).then((con) => {
  console.log(con.connection.host);
});

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode: development");
}

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/materials", materialRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`This url is not exist: ${req.url}`, 400));
});

app.use(global);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection: ${err.name}, ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
