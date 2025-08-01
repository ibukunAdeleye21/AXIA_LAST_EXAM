const express = require("express");
const {uploadSingleFile, uploadArrayOfFiles, uploadMultipleFieldWithArrayOfFiles} = require("../controllers/post.controller");
const route = express.Router();
const upload = require("../utils/multer");

const multipleFieldUpload = upload.fields([
    {name: "previewPix", maxCount: 2},
    {name: "displayPix", maxCount: 2}
]);

route.post("/upload-single", upload.single("previewPix"), uploadSingleFile);

route.post("/upload-array", upload.array("previewPix", 2), uploadArrayOfFiles);

route.post("/upload-multiple", multipleFieldUpload, uploadMultipleFieldWithArrayOfFiles);

module.exports = route;