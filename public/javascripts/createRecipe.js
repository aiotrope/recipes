"use strict";

var ingredientsArr = new Array();
var instructionsArr = new Array();

function MakeReq() {
  let globArr = document.querySelector("#glob-recipes-var").textContent;
  //console.log(globArr);
  if (globArr == 0 && window.location.href === "http://localhost:3000/") {
    let data = {
      name: "Pizza",
      ingredient: ["Flour", "Yeast", "Water"],
      instruction: ["Proof", "Bake"],
    };
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      Cache: "default",
    };

    fetch("http://localhost:3000/recipe/", settings)
      .then((res) => {
        res
          .json()
          .then((data) => {
            console.log(data);
            if (data.name) {
              fetch(`http://127.0.0.1:3000/recipe/${data.name}`);
              window.location.href = `http://127.0.0.1:3000/recipe/${data.name}`;
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
}


function CaptureIngredient() {
  let inputIngredient = document.querySelector("#ingredients-text").value;
  ingredientsArr.push(inputIngredient);

  let asIngredient = document.getElementById("as-ingredient");
  console.log([...ingredientsArr].join(" "));
  asIngredient.innerHTML = [...ingredientsArr].join(" ");
  document.getElementById("ingredients-text").value = "";
}

function CaptureInstruction() {
  let inputInstruction = document.querySelector("#instructions-text").value;
  instructionsArr.push(inputInstruction);
  let asInstruction = document.getElementById("as-instruction");
  console.log([...instructionsArr].join(" "));
  asInstruction.innerHTML = [...instructionsArr].join(" ");
  document.getElementById("instructions-text").value = "";
}

const saveForm = document.querySelector("#create-form");
const saveRecipeResponse = document.querySelector("#save-recipe-response");
saveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputName = document.querySelector("#name-text");
  const url = "http://localhost:3000/recipe/";
  let data = {
    name: inputName.value,
    ingredient: ingredientsArr,
    instruction: instructionsArr,
  };
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    Cache: "default",
  };

  fetch(url, settings)
    .then((res) => {
      res
        .json()
        .then((data) => {
          console.log(data);
          setTimeout(() => {
            window.location.reload();
            window.location.href = `http://127.0.0.1:3000/recipe/${data.name}`;
          }, 2000);
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

MakeReq();


