const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const multer = require("multer");
var fileupload = require("express-fileupload");
var upload = multer();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");

const app = express();

var partialObj = {
  ingredients: [
    "12 large guajillo chiles",
    "1/4 cup corn masa harina",
    "1/4 cup unsalted peanuts",
    "1/4 cup raisins",
    "1 whole clove",
  ],
  instructions: [
    "Gather the ingredients.",
    "Make the Mole Base",
    "Mix and Cook the Mole",
  ],
};

var Recipes = [
  {
    name: "Mole",
    ...partialObj,
  },
];

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// global var
app.set("Recipes", Recipes);
app.set("partialObj", partialObj);
app.locals.globRecipesVar = Recipes;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(cors());
//app.use(upload.array());
app.use(fileupload());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(200).json({});
  }
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
