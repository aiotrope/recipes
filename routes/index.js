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

module.exports = router
