const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  let Recipes = req.app.get('Recipes')
  res.json(Recipes)
})

router.get('/:food', (req, res) => {
  let Recipes = req.app.get('Recipes')
  let { food } = req.params
  const partial = req.app.get('partialObj')
  let recipeObj = Recipes.find((element) => element.name === food)
  if (!recipeObj) {
    recipeObj = {
      name: food,
      ...partial,
    }
  }

  if (req.header('Accept').includes('application/json')) {
    res.json({ ...recipeObj })
  } else {
    res.render('index', {
      title: 'Recipes',
      ...recipeObj,
    })
  }
})

// Saving recipe
router.post('/', (req, res) => {
  let Recipes = req.app.get('Recipes')
  let { name, instruction, ingredient } = req.body

  //console.log(images);
  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
  }

  Recipes.unshift(data)

  let newRecipe = Recipes.find((element) => element.name === name)

  if (req.header('Accept').includes('application/json') || newRecipe) {
    res.json({
      ...newRecipe,
    })
  } else {
    res.render('index', {
      title: 'Recipes Website',
      ...data,
    })
  }
})

module.exports = router
