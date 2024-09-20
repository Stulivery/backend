const bcrypt = require("bcrypt");
const imageUploadModel = require("../models/imageUploadModel");

const uploadImageController = async (req, res) => {
    await imageUploadModel.createTable();
    const userID = req.userId
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
        if(getimage) {
            res.status(201).json({message: 'successful', image:getimage.profilepicture});
        }
        else {
            res.status(403).json({message: 'Uploading failed', image: null})
        }
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    uploadImageController,
    insertProfilePicController,
    getProfilePictureController
};
