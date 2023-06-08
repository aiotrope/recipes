const express = require("express");
const axios = require("axios");
const router = express.Router();

//const Recipes = [];

/* GET home page. */
router.get("/", (req, res, next) => {
  let Recipes = req.app.get("Recipes");
  res.render("index", { title: "Recipes", recipes: Recipes });
});

// Saving user
router.post("/recipe/", (req, res, next) => {
  let { name, instruction, ingredient } = req.body;
  let Recipes = req.app.get("Recipes");

  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
  };

  const foundRecipe = Recipes.findIndex((element) => element.name === name);
  if (foundRecipe !== -1) {
    Recipes[foundRecipe].instructions.unshift(instruction);
    Recipes[foundRecipe].ingredients.unshift(ingredient);
    let checkRecipe = Recipes.find((element) => element.name === name);
    res.send({ ...checkRecipe });
  } else {
    Recipes.unshift(data);

    let newRecipe = Recipes.find((element) => element.name === name);
    if (newRecipe) {
      res.send({ ...newRecipe });
    }
  }
});

router.get("/recipe/:food", (req, res) => {
  const { food } = req.params;
  let Recipes = req.app.get("Recipes");
  //console.log(food);
  const foundRecipe = Recipes.find((element) => element.name === food);
  if (foundRecipe) {
    res.render('recipe',{
      ...foundRecipe,
      title: "Recipes",
      recipes: Recipes,
    });
  }
});

module.exports = router;
