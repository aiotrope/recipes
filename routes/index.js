/* eslint-disable no-unused-vars */
const express = require('express')
const axios = require('axios')
const path = require('path')

const router = express.Router()

var partialObj = {
  ingredients: [
    '12 large guajillo chiles',
    '1/4 cup corn masa harina',
    '1/4 cup unsalted peanuts',
    '1/4 cup raisins',
    '1 whole clove',
  ],
  instructions: [
    'Gather the ingredients.',
    'Make the Mole Base',
    'Mix and Cook the Mole',
  ],
}

var Recipes = [
  {
    name: 'Mole',
    ...partialObj,
  },
]

//var newEntry

router.get('/recipe', (req, res) => {
  res.status(200).json(Recipes)
})

router.get('/recipe/:food', (req, res) => {
  let { food } = req.params
  let recipe = Recipes.find((element) => element.name === food)
  //food = req.app.locals.blankParams
  //console.log(food)
  if (recipe) {
    res.status(200).json({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    })
  } else if (!recipe) {
    req.app.locals.blankParams = food
    console.log(req.app.locals.blankParams)
  }
})

router.get('/', (req, res) => {
  res.render('recipe', { title: 'Recipes' })
})

router.post('/recipe/', (req, res) => {
  //const recipes = req.app.get('Recipes')
  const recipes = Recipes
  let { name, instruction, ingredient } = req.body

  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
  }

  recipes.unshift(data)

  let newRecipe = recipes.find((element) => element.name === name)

  if (newRecipe) {
    return res.status(200).json(newRecipe)
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
