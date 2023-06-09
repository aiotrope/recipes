const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
var fileupload = require('express-fileupload')

const indexRouter = require('./routes/index')

const app = express()

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

var Recipes = [
  {
    name: 'Mole',
    ...partialObj,
  },
]

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// global var
app.set('Recipes', Recipes)
app.set('partialObj', partialObj)
app.locals.globRecipesVar = Recipes

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(fileupload())

app.use('/', indexRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
