const db = require("../database/db");
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS wallet(
            id INT AUTO_INCREMENT PRIMARY KEY,
            userID VARCHAR(200),
            acctname VARCHAR(200),
            walletID VARCHAR(25),
            acctnumber VARCHAR(200),
            pin VARCHAR(200) 
        )
  `;
    await db.execute(query);
};

const insertWalletDetails = async (userID, acctname, acctnumber, walletID, pin) => {
    const query = "INSERT INTO wallet(userID, acctname, acctnumber, walletID, pin) VALUE(?,?,?,?,?)";
    const [result] = await db.execute(query, [userID, acctname, acctnumber, walletID, pin]);
    return result.insertId;
};

module.exports = {
    createTable,
    insertWalletDetails
}
