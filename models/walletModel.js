const db = require("../database/db");
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS wallet(
            id INT AUTO_INCREMENT PRIMARY KEY,
            userID VARCHAR(200),
            acctname VARCHAR(200),
            walletID VARCHAR(25),
            acctnumber VARCHAR(200),
            acctbalance VARCHAR(200),
            transactionpin VARCHAR(200) ,
            bankname VARCHAR(200)
        )
  `;
    await db.execute(query);
};

const insertWalletDetails = async (userID, acctname, acctnumber, walletID, acctbalance, bankname, pin) => {
    console.log(userID);
    const query = "INSERT INTO wallet(userID, acctname, acctnumber, walletID, acctbalance, bankname, transactionpin) VALUE(?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [userID, acctname, acctnumber, walletID, acctbalance, bankname, pin]);
    return result.insertId;
};

const getWalletDetails = async (userID) => {
    const query = 'SELECT * FROM wallet WHERE userID=?'
    const [result] = await db.execute(query, [userID]);
    console.log(result);
    return result;
}

module.exports = {
    createTable,
    insertWalletDetails,
    getWalletDetails
}
