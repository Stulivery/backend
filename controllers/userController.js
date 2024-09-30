const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const transporter = require("../services/emailServices");
const SECRET_KEY = process.env.SECRET_KEY;
const { VerifyTemplate } = require('../services/emailTemplate'); 
const { GenerateRandom } = require("../services/randomnumber");
const { verifyOtpToken } = require("../services/validateotp");

const generateOtp=async(req,res)=>{
    const {email}=req.body
    const otp=GenerateRandom()
    const mailOptions={
        from:'miresumiresume@gmail.com',
        to:email,
        subject:'Email Verification',
        html:VerifyTemplate(otp)
    }
    transporter.sendMail(mailOptions,async(error,info)=>{
        if(error){
            console.error(error)
            res.status(500).json({message:'Error sending email'})
        }
        else{
            // sign jwt 
            console.log('Email sent:' + info.response)
            const token = jwt.sign({ otp }, SECRET_KEY, { expiresIn: '5m' }); // 24 hours
            res.status(201).json({otptoken: token, message: "successful" });
        }
    }) 
}
const verifyEmail = async (req, res) => {
    const { otp } = req.body; // OTP sent by the client
    console.log("OTP from request body:", otp);
    
    const otpToken = req.otp; // This is the OTP extracted from the token
    console.log("OTP from token:", otpToken);
  
    // Now you can check if the provided OTP matches the OTP from the token
    if (!otpToken) {
      return res.status(403).json({ auth: false, message: 'No token provided.' });
    }
  
    try {
      if (otp.toString() === otpToken.toString()) {
        console.log('OTP is valid!');
        return res.status(201).json({ message: 'Verify Successful' });
      } else {
        console.log('OTP is invalid or expired!');
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
const userRegistration = async (req, res) => {
    await userModel.createTable();
    //Name,Phonenumber,email,Password,Address,GenderSelectOption,StudentId,roleSelectOption
    const { Name,Phonenumber,email,Password,Address,GenderSelectOption,StudentId,roleSelectOption } = req.body;
    const verificationstatus = false;
    const userstatus='user'
    const hashedPassword = await bcrypt.hash(Password, 8);
    const checkEmail = await userModel.getUserByEmail(email);
    if (checkEmail) {
        res.status(403).json({ message: "Email already exists" });
        return;
    }
    else {
        try {
            const userId = await userModel.insertUser(Name,Phonenumber,email,hashedPassword,Address,GenderSelectOption,StudentId,roleSelectOption,verificationstatus,userstatus);
            if(!userId) {
                return res.status(201).json({ id: null, message: "failed" });
            }
            res.status(201).json({ id: userId, message: "successful" });
        } catch (error) {
            console.log(error);
        }
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const getrows = await userModel.getUserByEmail(email);
    if (!getrows) {
        return res.status(403).json({ auth: false, token: null, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compareSync(password, getrows.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ id: getrows.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
    res.status(201).json({ auth: true, token: token, message: "successful" });
};

const sendEmail = (req, res) => {
    const id = req.userId;
    const { email } = req.body;
    function generateRandom4DigitNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    };
    const otp = generateRandom4DigitNumber();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const mailOptions = {
        from: "stulvilery@gmail.com",
        to: email,
        subject: "Email Verification",
        html: VerifyTemplate(otp),
    };
    try {
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(error);
                res.status(403).json({ message: "Email not sent" });
                return
            } else {
                const updateuser = await userModel.updateUserOtp(id, otp, expiresAt);
                if (updateuser === 0) {
                    res.status(404).json({ error: "Otp error" });
                } else {
                    res.status(200).json({ message: "Email sent" });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const validateOtp = async (req, res) => {
    const id = req.userId;
    const { otp } = req.body;
    const getrows = await userModel.getUserById(id);
    const userotp = getrows.otp;
    const userexpireAt = new Date(getrows.expireAt).getTime();
    if (!userotp || !userexpireAt) {
        return res.status(404).json({ message: "No OTP found" });
    }
    if (Date.parse(new Date().getTime()) > Date.parse(getrows.expireAt)) {
        return res.status(403).json({ message: "OTP has expired" });
    }
    if (otp == userotp) {
        const verifcationstatus = true;
        const updateuser = await userModel.updateUserVerificationStatus(id, verifcationstatus);
        if (updateuser === 0) {
            return res.status(404).json({ message: "User not found" });
        } else {
            return res.status(201).json({ message: "OTP verified successfully" });
        }
    } else {
        return res.status(403).json({ message: "Invalid OTP" });
    }
};

const updatePassword = async (req, res) => {
    const id = req.userId;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const updatePassword = await userModel.updateUserPassword(hashedPassword,id);
    if (updatePassword === 0) {
        return res.status(403).json({message: "Password change failed"});
    } else {
        return res.status(201).json({message: "Password change successful"});
    }
}

const updateUserType = async (req, res) => {
    const id = req.userId;
    const { role, userstatus } = req.body;
    let deliveryManID
    const updateuserstatus = await userModel.updateUserType(id, userstatus, role);
    if(role !== 'user') {
        function generateRandom7DigitNumber() {
            return Math.floor(Math.random() * 9000000) + 1000000;
        };
        deliveryManID = `STU${generateRandom7DigitNumber()}DEL`;
        console.log(id, deliveryManID);
        const checkExistID = await userModel.getDeliveryMAnID(id, deliveryManID);
        if(checkExistID){
            return res.status(403).json({message: 'Error try again'});
        }
        else {
            const updatedeliveryidstatus = await userModel.updateUserDeliveryID(id, deliveryManID);
        }
    }
    if (updateuserstatus === 0) {
        return res.status(403).json({message: "Status change failed"});
    } else {
        return res.status(201).json({message: "Status change successful", deliveryManID: deliveryManID});
    }
}

const updateUserDetails = async (req, res) => {
    const id = req.userId;
    const {gender,address,phonenumber}=req.body
    try{
        const updateuser=await userModel.updateUser(id,gender,address,phonenumber)
        if (updateuser === 0) {
            res.status(403).json({ message: 'User not found' });
        } else {
            res.status(201).json({ message: 'User updated' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Failed to update user' });
    }
}

const updateUserPin = async (req, res) => {
    const userID = req.userId;
    const { pin } = req.body;
    const hashPin = await bcrypt.hash(pin, 8);
    try {
        const updatepin = await userModel.updateUSerPin(userID, hashPin);
        if(updatepin===0){
            res.status(403).json({ message: 'User not found' });
        } else {
            res.status(201).json({ message: 'User pin updated' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Failed to update user' });
    }
}

const updateVerificationDetails = async (req, res) => {
    const userID = req.userId;
    const { bvn, nin } = req.body;
    const hashBvn = await bcrypt.hash(bvn, 8);
    const hashNin = await bcrypt.hash(nin, 8);
    try {
        const updatedetails = await userModel.updateVerificationDetails(userID, hashBvn, hashNin);
        if (updatedetails === 0) {
            res.status(403).json({ message: 'User not found' });
        } else {
            res.status(201).json({ message: 'User details updated' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Failed to update user details' });
    }
};

const getUserDetails = async (req, res) => {
    const userID = req.userId;
    try {
        const getrows = await userModel.getUserById(userID);
        if(!getrows) {
            return res.status(403).json({message: 'User not found', details: null});
        }
        else {
            // "details": {
            //     "id": 1,
            //     "name": "SamuelOni",
            //     "email": "samueloni0987@gmail.com",
            //     "phonenumber": "09025243830",
            //     "password": "$2b$08$YS6i5VbKcsbwVzFwiukfWeNNOm2XR7cZiQLCRkAQiuCmTbxyt66By",
            //     "address": "Akure",
            //     "verificationstatus": 0,
            //     "userstatus": null,
            //     "role": null,
            //     "otp": null,
            //     "gender": "male",
            //     "expireAt": null,
            //     "deliveryManID": null,
            //     "pin": null,
            //     "bvn": null,
            //     "nin": null
            //   }
            const data = {
                name: getrows.name,
                email: getrows.email,
                phonenumber: getrows.phonenumber,
                address: getrows.address,
                gender: getrows.gender,
                role: getrows.role
            };
            res.status(201).json({message: 'successful', details: data});
        }
    } catch (error) {
        res.status(404).json({message: 'Failed to get user details'});
    }
};

module.exports = {
    generateOtp,
    verifyEmail,
    userRegistration,
    userLogin,
    sendEmail,
    validateOtp,
    updatePassword,
    updateUserType,
    updateUserDetails,
    updateUserPin,
    updateVerificationDetails,
    getUserDetails
};
 