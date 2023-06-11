const express = require('express')
const axios = require('axios')
const path = require('path')

const router = express.Router()

/* var partialObj = {
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
] */

let newEntry

router.get('/recipe', (req, res) => {
  const recipes = req.app.get('Recipes')
  res.status(200).json(recipes)
})

router.get('/recipe/:food', (req, res) => {
  let { food } = req.params
  const recipes = req.app.get('Recipes')
  const partial = req.app.get('partialObj')
  let recipe = recipes.find((element) => element.name === food)
  if (!recipe) {
    //console.log(partialObj.ingredients)
    axios
      .post('http://localhost:3000/recipe/', {
        name: food,
        ingredient: partial.ingredients,
        instruction: partial.instructions,
      })
      .then((response) => {
        let resp = response.data
        if (response) {
          res.status(200).json({
            name: resp.name,
            ingredients: resp.ingredients,
            instructions: resp.instructions,
          })
          newEntry = response.data.name
          //console.log(recipes)
        }
      })
      .catch((e) => console.error(e))
  } else {
    res.send({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    })
  }
})

router.get('/', (req, res) => {
  const recipes = req.app.get('Recipes')
  let recipe = recipes[0]
  console.log(recipes)
  if (recipes.length > 1) {
    axios
      .get(`http://localhost:3000/recipe/${newEntry}`)
      .then((response) => {
        //console.log(response?.data)
        res.render('recipe', { title: 'Recipes', ...response.data })
      })
      .catch((e) => console.error(e))
  } else {
    res.render('recipe', { title: 'Recipes', ...recipe })
  }
})

router.post('/recipe/', (req, res) => {
  const recipes = req.app.get('Recipes')
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
