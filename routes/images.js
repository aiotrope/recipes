const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + "--" + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/", upload.array("files"), (req, res) => {
  res.json({
    success: true,
    images: req.files,
  });
});

router.post("/upload", upload.array("files"), (req, res) => {
  let { name } = req.body;
  console.log(name);
  res.json({
    success: true,
    name: name,
    images: req.files,
  });
});

module.exports = router;
