/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []
var globArr = document.querySelector('#glob-recipes-var').innerHTML
var renderArr = JSON.parse(globArr)
var arr = [...renderArr]
var renderRecipes = document.querySelector('#render-recipes')

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
  //console.log([...ingredientsArr].join(" "))
  //console.log(Array.isArray(renderArr))
  //document.getElementById('recipe-name').innerHTML
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
    //console.log('Success:', result)

    if (result) {
      renderArr.unshift(result)
      arr.forEach((element) => {
        let h2 = document.createElement('h2')
        let link1 = document.createElement('a')
        let h3 = document.createElement('h3')

        link1.href = `http://localhost:3000/recipe/${element.name}`
        link1.innerText = element.name
        h2.appendChild(link1)
        renderRecipes.appendChild(h2)
        h3.textContent = 'Ingredients'
        renderRecipes.appendChild(h3)

        element.ingredients.map((el, i) => {
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

        element.instructions.map((el, i) => {
          let ul = document.createElement('ul')
          let li = document.createElement('li')
          let inst = document.createTextNode(el)
          let li1 = li.appendChild(inst)
          ul.appendChild(li1)
          renderRecipes.appendChild(ul)
        })
      })

      //return result
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

const renderData = () => {
  arr.forEach((element) => {
    let h2 = document.createElement('h2')
    let link1 = document.createElement('a')
    let h3 = document.createElement('h3')

    link1.href = `http://localhost:3000/recipe/${element.name}`
    link1.innerText = element.name
    h2.appendChild(link1)
    renderRecipes.appendChild(h2)
    h3.textContent = 'Ingredients'
    renderRecipes.appendChild(h3)

    element.ingredients.map((el, i) => {
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

    element.instructions.map((el, i) => {
      let ul = document.createElement('ul')
      let li = document.createElement('li')
      let inst = document.createTextNode(el)
      let li1 = li.appendChild(inst)
      ul.appendChild(li1)
      renderRecipes.appendChild(ul)
    })
  })
}

//renderData()
