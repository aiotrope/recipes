const express = require("express");
const router = express.Router();

const Recipes = [];


/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Recipes", recipes: Recipes });
});

// Saving user
router.post("/recipe/", (req, res, next) => {
  let { name, instruction, ingredient } = req.body;

  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction
  };

  const foundRecipe = Recipes.findIndex((element) => element.name === name);
  if (foundRecipe !== -1) {
    Recipes[foundRecipe].instructions.unshift(instruction);
    Recipes[foundRecipe].ingredients.unshift(ingredient);
   let checkRecipe = Recipes.find((element) => element.name === name)
    res.json({ result: checkRecipe });
  } else {
    Recipes.unshift(data);

    let newRecipe =  Recipes.find((element) => element.name === name)
    console.log(newRecipe)
    res.json({ message: 'New recipe added', result: newRecipe });
  }
});

router.get("/recipe/:food", (req, res) => {
  const { food } = req.params;
  const foundRecipe = Recipes.find((element) => element.name === food);
  if (foundRecipe) {
    //console.log(foundUserParams)
    res.json({ result: foundRecipe });
  } else {
    res.json({ result: "Recipe not found" });
  }
});

module.exports = router;
