/* eslint-disable no-unused-vars */
const express = require('express')
const axios = require('axios')
const path = require('path')

const router = express.Router()

var partialObj = {
  instructions: [
    'Gather the ingredients.',
    'Make the Mole Base',
    'Mix and Cook the Mole',
  ],
  ingredients: [
    '12 large guajillo chiles',
    '1/4 cup corn masa harina',
    '1/4 cup unsalted peanuts',
    '1/4 cup raisins',
    '1 whole clove',
  ],
}

router.get('/recipe', (req, res) => {
  const recipes = req.app.locals.globRecipesVar
  res.status(200).json(recipes)
})

router.get('/recipe/:food', (req, res) => {
  let { food } = req.params
  let recipeStore = req.app.locals.globRecipesVar
  let recipe = recipeStore.find((element) => element.name === food)
  if (!recipe) {
    axios
      .post('http://localhost:3000/recipe/', {
        name: food,
        instruction: partialObj.instructions,
        ingredient: partialObj.ingredients,
      })
      .then((response) => {
        let resp = response.data
        if (resp) {
          recipeStore.push(resp)
          res.status(200).json({
            name: resp.name,
            instructions: resp.instructions,
            ingredients: resp.ingredients,
          })
        }
      })
      .catch((e) => console.error(e))
  } else {
    res.send({
      name: recipe.name,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
    })
  }
})
router.get('/', (req, res) => {
  res.render('recipe', { title: 'Recipes' })
})

router.post('/recipe/', (req, res) => {
  const recipes = req.app.get('Recipes')
  let { name, instruction, ingredient } = req.body

  let data = {
    name: name,
    instructions: instruction,
    ingredients: ingredient,
  }

  recipes.push(data)

  let newRecipe = recipes.find((element) => element.name === name)

  if (newRecipe) {
    res.status(200).json(newRecipe)
  }
})

router.post('/images', (req, res) => {
  let { recipe } = req.body
  let { images } = req.files
  //console.log(req.files.path);
  let uploadPath
  uploadPath = path.resolve('./uploads') + '/recipe' + images.name
  images.mv(uploadPath)

  if (!images || Object.keys(images).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }

  let data = {
    recipe: recipe,
    images: [images],
  }

  res.send({
    ...data,
    result: 'File image uploaded.',
  })
})

module.exports = router
