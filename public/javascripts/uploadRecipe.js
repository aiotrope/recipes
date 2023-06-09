/* eslint-disable no-undef */

function UploadRecipe() {
  let globArr = document.querySelector('#glob-recipes-var').textContent
  // eslint-disable-next-line eqeqeq
  if (globArr == 1) {
    let data = {
      name: 'Pizza',
      ingredient: ['Flour', 'Yeast', 'Water'],
      instruction: ['Proof', 'Bake'],
    }
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      Cache: 'default',
    }

    fetch('http://localhost:3000/recipe/', settings)
      .then((res) => {
        res
          .json()
          .then((data) => {
            console.log(data)
            if (data.name) {
              //fetch(`http://127.0.0.1:3000/recipe/${data.name}`)
              window.location.reload()
              //return data
            }
          })
          .catch((e) => console.error(e))
      })
      .catch((e) => console.error(e))
  }
}

UploadRecipe()
