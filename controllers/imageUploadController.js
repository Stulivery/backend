const bcrypt = require("bcrypt");
const imageUploadModel = require("../models/imageUploadModel");
const path = require('path');
const mimeTypes = require('mime-types');
const fs = require('fs');
const uploadImageController = async (req, res) => {
    await imageUploadModel.createTable();
    const userID = req.userId;
    const filename = req.file.filename;
    try {
        const insertimage = await imageUploadModel.insertImage(filename, userID);
        if(insertimage) {
            res.status(201).json({message: 'Uploading successful'})
        }
        else {
            res.status(403).json({message: 'Uploading failed'})
        }
    } catch(error){
        console.log(error);
    }
};

const insertProfilePicController = async (req, res) => {
    const userID = req.userId;
    const profilepicture = req.file.filename;
    try {
        const insertimage = await imageUploadModel.updateProfilePic(profilepicture, userID);
        if(insertimage) {
            res.status(201).json({message: 'Uploading successful'})
        }
        else {
            res.status(403).json({message: 'Uploading failed'})
        }
    } catch(error){
        console.log(error);
    }
}

const getProfilePictureController = async (req,res)=> {
    const userID = req.userId;
    try {
        const getimage = await imageUploadModel.insertImage(filename, userID);
        const imageFolder = path.join(__dirname, '../profilepicture');
        const imagePath = path.join(imageFolder, getimage.profilepicture)
        if(!fs.existsSync(imagePath)) {
            return res.status(403).json({message: 'Image not found', image: null});
        }
        const imageType = mimeTypes.lookup(imagePath);
        res.setHeader('Content-Type', imageType);
        res.status(201).json({message: 'successful', image: imagePath});
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    uploadImageController,
    insertProfilePicController,
    getProfilePictureController
};
