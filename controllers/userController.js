const bcryptjs = require("bcrypt");
const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const transporter = require("../services/emailServices");
const SECRET_KEY = process.env.SECRET_KEY;
const userRegistration = async (req, res) => {
    await userModel.createTable();
    const { name, email, phonenumber, address, password, verificationstatus } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const checkEmail = await userModel.getUserByEmail(email);
    if (checkEmail.length > 0) {
        res.status(403).json({ message: "Email already exists" });
        return;
    }
    else {
        try {
            const userId = await userModel.insertUser(name, email, hashedPassword, phonenumber, address, verificationstatus);
            console.log(userId);
            if(!userId) {
                return res.status(201).json({ id: null, message: "failed" });
            }
            res.status(201).json({ id: userId, message: "successful" });
        } catch (error) {
            console.log(error);
        }
    }
    console.log(checkEmail)
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const getUser = await userModel.getUserByEmail(email);
    if (!getUser) {
        res.status(403).json({ auth: false, token: null, message: "User not found" });
        return
    }
    console.log(getUser)
    const isPasswordValid = await bcrypt.compareSync(password, getUser[0].password);
    if (!isPasswordValid) {
        res.status(403).json({ message: "Invalid Password" });
        return;
    }
    const token = jwt.sign({ id: getUser.id }, 'SECRET_KEY', { expiresIn: 86400 });
    res.status(201).json({ auth: true, token: token, message: "successful" });
};

const sendEmail = (req, res) => {
    const { email, id } = req.body;
    function generateRandom6DigitNumber() {
        return Math.floor(Math.random() * 9000) + 1000;
    }
    const otp = generateRandom6DigitNumber();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const mailOptions = {
        from: "stulvilery@gmail.com",
        to: email,
        subject: "Email Verification",
        html: `<b>Your otp is ${otp} </b>`,
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
    const { otp, id } = req.body;
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
        const updateuser = await userModel.updateUserStatus(id, verifcationstatus);
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
    const { password, id } = req.body;
    const getrows = await userModel.getUserById(id);
    const updatePassword = await userModel.updateUserPassword(password,id);
    if (updatePassword === 0) {
        return res.status(403).json({message: "password change failed"});
    } else {
        return res.status(201).json({message: "Password change successful"});
    }
}

module.exports = {
    userRegistration,
    userLogin,
    sendEmail,
    validateOtp,
    updatePassword
};
