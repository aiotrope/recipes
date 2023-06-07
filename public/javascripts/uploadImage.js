const form = document.getElementById("upload-form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById("image-name");
  const files = document.getElementById("image-input");
  const formData = new FormData();
  formData.append("name", name.value);
  for (let i = 0; i < files.files.length; i++) {
    formData.append("files", files.files[i]);
  }
  fetch("http://localhost:3000/images", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => console.log(res))
    .catch((err) => ("Error occured", err));
}
