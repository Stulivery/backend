const walletModel = require("../models/walletModel");
const encryptionServices = require("../services/encryptServices");
const bcrypt = require("bcrypt");
const insertWalletDetailsController = async (req, res) => {
    await walletModel.createTable();
    const userID = req.userId;
    const { acctname, acctnumber, pin, acctbalance, bankname } = req.body;
    function generateRandom7DigitNumber() {
        return Math.floor(Math.random() * 9000000) + 1000000;
    }
    const walletID = `STU${generateRandom7DigitNumber()}WALLET`;
    const hashAccountName = await encryptionServices.encryptAlgorithm(acctname);
    const hashAccountNumber = await encryptionServices.encryptAlgorithm(acctnumber);
    const hashWalletID = await encryptionServices.encryptAlgorithm(walletID);
    const hashPin = await encryptionServices.encryptAlgorithm(pin);
    const hashUserID = await bcrypt.hash(`${userID}`, 8);
    const hashAcctBalance = await encryptionServices.encryptAlgorithm(acctbalance);
    const hashBankName = await encryptionServices.encryptAlgorithm(bankname);
    // console.log({
    //     acctname: hashAccountName,
    //     acctname: hashAccountNumber,
    //     transactionpin: hashPin,
    //     userID: hashUserID,
    //     walletID: hashWalletID,
    //     acctbalance: hashAcctBalance,
    //     bankname: hashBankName,
    // });
    try {
        const insertwalletdetails = await walletModel.insertWalletDetails(
            userID,
            hashAccountName,
            hashAccountNumber,
            hashWalletID,
            hashAcctBalance,
            hashBankName,
            hashPin
        );
        if (!insertwalletdetails) {
            return res.status(403).json({ message: "Error try again" });
        } else {
            res.status(201).json({ message: "successful" });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Error try again" });
    }
};

const getWalletDetailController = async (req, res) => {
    const userID = req.userId;
    const hashUserID = await bcrypt.hash(`${userID}`, 8);
    console.log(hashUserID);
    try {
        const getrows = await walletModel.getWalletDetails(userID);
        console.log(getrows);
        if (!getrows) {
            return res.status(403).json({ message: "Wallet not found" });
        } else {
            const hashAccountName = await encryptionServices.decryptAlgorithm(getrows.acctname);
            const hashAccountNumber = await encryptionServices.decryptAlgorithm(getrows.acctnumber);
            const hashWalletID = await encryptionServices.decryptAlgorithm(getrows.walletID);
            const hashPin = await encryptionServices.decryptAlgorithm(getrows.transactionpin);
            const hashAcctBalance = await encryptionServices.decryptAlgorithm(getrows.acctbalance);
            const hashBankName = await encryptionServices.decryptAlgorithm(getrows.bankname);
            const data = {
                acctname: hashAccountName,
                acctnumber: hashAccountNumber,
                walletID: hashWalletID,
                acctbalance: hashAcctBalance,
                bankname: hashBankName,
            };
            console.log(data);
            res.status(403).json({ message: "successful", walletDetails: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Error try again" });
    }
};

module.exports = {
    insertWalletDetailsController,
    getWalletDetailController,
};
