const express = require("express");
const axios = require("axios");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + "--" + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

//const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/recipe", (req, res) => {
  let Recipes = req.app.get("Recipes");
  res.json({ ...Recipes });
});

router.get("/recipe/:food", (req, res) => {
  let Recipes = req.app.get("Recipes");
  let { food } = req.params;
  const partial = req.app.get("partialObj");
  let recipeObj = Recipes.find((element) => element.name === food);
  if (!recipeObj) {
    recipeObj = {
      name: food,
      partial,
    };
  }

  if (req.header("Accept").includes("application/json")) {
    res.json(recipeObj);
  } else {
    res.render("recipe", {
      title: "Recipes",
      ...recipeObj,
    });
  }
});

// test /recipe/:id in / route
router.get("/", (req, res, next) => {
  let Recipes = req.app.get("Recipes");
  let recipe = Recipes[0];

  axios(`http://localhost:3000/recipe/${recipe.name}`)
    .then((response) => {
      //console.log(response.data);
      res.render("index", { title: "Recipes", ...response.data });
    })
    .catch((e) => console.error(e));
});

// Saving recipe
router.post("/recipe/", (req, res, next) => {
  let Recipes = req.app.get("Recipes");
  let { name, instruction, ingredient } = req.body;
  let { images } = req.files;
  //console.log(req.files.path);

  let uploadPath;

  console.log(images);
  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
    images: [images],
  };

  uploadPath = path.resolve("./uploads") + '/temp' + images.name;

  images.mv(uploadPath)

  Recipes.unshift(data);

  let newRecipe = Recipes.find((element) => element.name === name);
  if (!images || Object.keys(images).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  if (newRecipe) {
    res.send({
      ...newRecipe,
    });
  }
});

router.post("/images", upload.array("images", 12), (req, res) => {
  console.log(req.files.path);
  //console.log(req.files);
  res.send({
    success: true,
    images: req.files.path,
  });
});

module.exports = router;
