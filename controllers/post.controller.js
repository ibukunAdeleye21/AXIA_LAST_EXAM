const mongoose = require("mongoose");
const logger = require("../utils/logger");
const postModel = require("../models/post.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs/promises");

const uploadSingleFile = async (req, res) => {
    logger.info("Incoming request to upload a single file in a post");

    const body = req.body;
    const file = req.file;

    try {
        logger.debug("Uploading to cloudinary");
        const previewPixUploadResponse = await cloudinary.uploader.upload(file.path);

        logger.info("Upload to cloudinary successful");

        // append the uploaded file to the body
        logger.debug("Append the uploaded file to the body...");
        body["previewPix"] = previewPixUploadResponse.secure_url;

        logger.info("Successfully appended the uploaded file to the body");

        // create post
        logger.debug("Creating Post...");
        const newPost = new postModel({...body});

        const savedPost = await newPost.save();
        logger.info(`Post saved successfully in the database with ID: ${savedPost._id}`);

        logger.debug("Unlink file path...");
        await fs.unlink(file.path);

        logger.info("Successful unlinking");

        logger.info(`Post created successfully with ID: ${savedPost._id}`)
        return res.status(201).json({message: "Post created successfully"});

    } catch (error) {
        logger.error(`Error creating post: ${error.message}`);
        return res.status(500).json({ message: "Create post failed" });
    }
}

const uploadArrayOfFiles = async (req, res) => {
    logger.info("Incoming request to upload an array files in a post");

    const body = req.body;
    const files = req.files;

    try {
        logger.debug("Uploading to cloudinary...");
        const arrayOfUploadedResults = [];

        for (const file of files)
        {
            const uploadResponse = await cloudinary.uploader.upload(file.path);
            arrayOfUploadedResults.push(uploadResponse.secure_url);
            await fs.unlink(file.path);
        }

        logger.info("All files uploaded");

        // add the uploaded files to the body
        logger.debug("Add array of uploaded files to the body...");
        body["previewPix"] = arrayOfUploadedResults;

        logger.debug("Creating Post with uploaded URLs...");
        const newPost = new postModel({ ...body });
        const savedPost = await newPost.save();
        logger.info(`Post saved successfully in the database with ID: ${savedPost._id}`);

        logger.info(`Post created successfully with ID: ${savedPost._id}`);
        return res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        logger.error(`Error creating post with files: ${error.message}`);
        return res.status(500).json({ message: "Create post failed" });
    }
}

const uploadMultipleFieldWithArrayOfFiles = async (req, res) => {
    logger.info("Incoming request to upload multiple field with array of files in a post")
    const body = req.body;
    const files = req.files;

    try {
        logger.debug("Uploading to cloudinary...");
        const uploadedPreviewUrls = [];
        const uploadedDisplayUrls = [];

        // Preview Pix upload
        logger.debug("Uploading previewPix to cloudinary...");
        if (files.previewPix)
        {
            for (const file of files.previewPix)
            {
                const uploadResponse = await cloudinary.uploader.upload(file.path);
                uploadedPreviewUrls.push(uploadResponse.secure_url);
                await fs.unlink(file.path);
            }
        }
        
        logger.info("All previewPix files uploaded");

        // Display Pix upload
        logger.debug("Uploading displayPix to cloudinary...");
        if (files.displayPix)
        {
            for (const file of files.displayPix)
            {
                const uploadResponse = await cloudinary.uploader.upload(file.path);
                uploadedDisplayUrls.push(uploadResponse.secure_url);
                await fs.unlink(file.path);
            }
        }

        logger.info("All displayPix files uploaded");

        logger.debug("Add uploaded URLs to body");

        // add uploadedPreviewUrls to the body
        logger.debug("Add uploadedPreviewUrls to the body...");
        body["previewPix"] = uploadedPreviewUrls;

        // add uploadedDisplayUrls to the body
        logger.debug("Add uploadedDisplayUrls to the body...");
        body["displayPix"] = uploadedDisplayUrls;

        // save post
        logger.debug("Creating Post with uploaded URLs...");
        const newPost = new postModel({ ...body });
        const savedPost = await newPost.save();
        logger.info(`Post saved successfully in the database with ID: ${savedPost._id}`);

        logger.info(`Post created successfully with ID: ${savedPost._id}`);
        return res.status(201).json({ message: "Post created successfully" });

    } catch (error) {
        logger.error(`Error creating post with files: ${error.message}`);
        return res.status(500).json({ message: "Create post failed" });   
    }
}

module.exports = {uploadSingleFile, uploadArrayOfFiles, uploadMultipleFieldWithArrayOfFiles};