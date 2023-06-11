/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []
var globArr = document.querySelector('#glob-recipes-var').innerHTML
var unfilteredGlobArr = JSON.parse(globArr)
var filteredGlobArr = unfilteredGlobArr.filter((el) => el.name !== 'Mole')
var renderRecipes = document.querySelector('#render-recipes')
var asIngredient = document.getElementById('as-ingredient')
var asInstruction = document.getElementById('as-instruction')

const saveForm = document.querySelector('#create-form')

document
  .getElementById('add-ingredient')
  .addEventListener('click', CaptureIngredient)
document
  .getElementById('add-instruction')
  .addEventListener('click', CaptureInstruction)

function CaptureIngredient() {
  let inputIngredient = document.querySelector('#ingredients-text').value
  ingredientsArr.push(inputIngredient)

  asIngredient.innerHTML = [...ingredientsArr].join(' ')
  document.getElementById('ingredients-text').value = ''
}

function CaptureInstruction() {
  let inputInstruction = document.querySelector('#instructions-text').value
  instructionsArr.push(inputInstruction)
  asInstruction.innerHTML = [...instructionsArr].join(' ')
  document.getElementById('instructions-text').value = ''
}

const fetchSingleRecipe = async () => {
  const food = unfilteredGlobArr.find((el) => el.name === 'Mole')
  const response = await fetch(`http://localhost:3000/recipe/${food.name}`)
  const data = await response.json()
  if (data && response.status === 200) renderRecipeData(data)
}

fetchSingleRecipe()

const postRecipe = async (data) => {
  try {
    const response = await fetch('http://localhost:3000/recipe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (response.status === 200 && result) {
      filteredGlobArr.push(result)
      filteredGlobArr.map((data) => {
        renderRecipeData(data)
      })
      return result
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const uploadImage = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/images', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

const clearForm = () => {
  saveForm.reset()
  ingredientsArr.length = 0
  instructionsArr.length = 0
  asIngredient.innerHTML = ''
  asInstruction.innerHTML = ''
}

saveForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const inputName = document.querySelector('#name-text')
  const images = document.querySelector('#image-input')
  const formData = new FormData()

  let data = {
    name: inputName.value,
    ingredient: ingredientsArr,
    instruction: instructionsArr,
  }

  formData.append('recipe', inputName.value)

  for (let i = 0; i < images.files.length; i++) {
    formData.append('images', images.files[i])
  }
  postRecipe(data)
  uploadImage(formData)
  clearForm()
})

const renderRecipeData = (data) => {
  let h2 = document.createElement('h2')
  let link = document.createElement('a')
  let h3 = document.createElement('h3')
  link.href = `http://localhost:3000/recipe/${data.name}`
  link.innerText = data.name
  h2.appendChild(link)
  renderRecipes.appendChild(h2)
  h3.textContent = 'Ingredients'
  renderRecipes.appendChild(h3)

  data.ingredients.map((el, i) => {
    let ul = document.createElement('ul')
    let li = document.createElement('li')
    let ings = document.createTextNode(el)
    let li1 = li.appendChild(ings)
    ul.appendChild(li1)
    renderRecipes.appendChild(ul)
  })

  let h3i = document.createElement('h3')
  h3i.textContent = 'Instructions'
  renderRecipes.appendChild(h3i)

  data.instructions.map((el, i) => {
    let ul = document.createElement('ul')
    let li = document.createElement('li')
    let inst = document.createTextNode(el)
    let li1 = li.appendChild(inst)
    ul.appendChild(li1)
    renderRecipes.appendChild(ul)
  })
}
