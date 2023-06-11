/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []
var globArr = document.querySelector('#glob-recipes-var').innerHTML
var renderArr = JSON.parse(globArr)
var arr = [...renderArr]
var renderRecipes = document.querySelector('#render-recipes')
var blankParams = document.querySelector('#blank-params').innerHTML

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
  let asIngredient = document.getElementById('as-ingredient')
  asIngredient.innerHTML = [...ingredientsArr].join(' ')
  document.getElementById('ingredients-text').value = ''
}

function CaptureInstruction() {
  let inputInstruction = document.querySelector('#instructions-text').value
  instructionsArr.push(inputInstruction)
  let asInstruction = document.getElementById('as-instruction')
  //console.log([...instructionsArr].join(" "));
  asInstruction.innerHTML = [...instructionsArr].join(' ')
  document.getElementById('instructions-text').value = ''
}

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
    console.log('Success:', result)
    //return result
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
    //console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

saveForm.addEventListener('submit', async (event) => {
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
  await postRecipe(data)
  await uploadImage(formData)

  //window.location.reload()
})

const RenderRecipes = async (url) => {
  try {
    const response = await fetch(url)
    const jsonData = await response.json()
    jsonData.map((data) => {
      let h2 = document.createElement('h2')
      let link = document.createElement('a')
      let h3 = document.createElement('h3')
      //console.log(data.name)
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
    })
  } catch (err) {
    console.error(err.message)
  }
}

RenderRecipes('http://localhost:3000/recipe')

if (blankParams !== null && blankParams !== null && blankParams !== 'Mole') {
  const ingredient = [
    '12 large guajillo chiles',
    '1/4 cup corn masa harina',
    '1/4 cup unsalted peanuts',
    '1/4 cup raisins',
    '1 whole clove',
  ]
  const instruction = [
    'Gather the ingredients.',
    'Make the Mole Base',
    'Mix and Cook the Mole',
  ]

  let data = {
    name: blankParams,
    ingredient: ingredient,
    instruction: instruction,
  }
  let a = postRecipe(data)
  console.log(a)
}

const fetchRecipe = async (params) => {
  try {
    const response = await fetch(`http://localhost:3000/recipe/${params}`)
    const jsonData = await response.json()
    if (jsonData.ok) {
      console.log(jsonData.name)
    }
  } catch (err) {
    console.error('Error on fetching', err.message)
  }
}

fetchRecipe(blankParams)

//postRecipe(blankParams)
