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

router.get('/recipe', (req, res) => {
  res.status(200).json(Recipes)
})

router.get('/recipe/:food', (req, res) => {
  let { food } = req.params
  let recipe = Recipes.find((element) => element.name === food)
  if (!recipe) {
    //console.log(partialObj.ingredients)
    axios
      .post('http://localhost:3000/recipe/', {
        name: food,
        ingredient: partialObj.ingredients,
        instruction: partialObj.instructions,
      })
      .then((response) => {
        if (response) res.send(response.data)
      })
      .catch((e) => console.error(e))
  } else {
    return res.status(200).json(recipe)
  }
})

router.get('/', (req, res) => {
  let recipe = Recipes[0]
  axios
    .get(`http://localhost:3000/recipe/${recipe.name}`)
    .then((response) => {
      //console.log(response?.data)
      res.render('recipe', { title: 'Recipes', ...response.data })
    })
    .catch((e) => console.error(e))
})

router.post('/recipe/', (req, res) => {
  let { name, instruction, ingredient } = req.body

  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
  }

  Recipes.unshift(data)

  let newRecipe = Recipes.find((element) => element.name === name)

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
