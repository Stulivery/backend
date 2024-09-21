const walletModel = require('../models/walletModel');
const bcrypt = require('bcrypt');

const insertWalletDetailsController = async (req, res) => {
    const userID = req.userID;
    const { acctname, acctnumber, pin } = req.body;
    function generateRandom7DigitNumber() {
        return Math.floor(Math.random() * 9000000) + 1000000;
    };
    const walletID = `STU${generateRandom7DigitNumber()}WALLET`;
    const hashAccountName = await bcrypt.hash(acctname, 8);
    const hashAccountNumber = await bcrypt.hash(acctnumber, 8);
    const hashWalletID = await bcrypt.hash(walletID, 8);
    const hashPin = await bcrypt.hash(pin, 8);
    const hashUserID = await bcrypt.hash(userID ,8)
    try {
        const insertwalletdetails = await walletModel.insertWalletDetails(hashUserID, hashAccountName, hashAccountNumber, hashWalletID, hashPin);
        if(!insertwalletdetails) {
            return res.status(403).json({message: 'Error try again'});
        }
        else {
            res.status(201).json({message:'successful'});
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    insertWalletDetailsController
}