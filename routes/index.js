/* eslint-disable no-unused-vars */
const express = require('express')
const axios = require('axios')
const path = require('path')

const router = express.Router()

router.get('/', (req, res, next) => {
  let Recipes = req.app.get('Recipes')
  let recipe = Recipes[0]

  axios(`http://localhost:3000/recipe/${recipe.name}`)
    .then((response) => {
      res.render('recipe', { title: 'Recipes', ...response.data })
    })
    .catch((e) => console.error(e))
})

router.post('/images', (req, res) => {
  let { recipe } = req.body
  let { images } = req.files
  //console.log(req.files.path);
  let uploadPath
  uploadPath = path.resolve('./uploads') + '/temp' + images.name
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
    result: 'Image file uploaded!',
  })
})

module.exports = router
