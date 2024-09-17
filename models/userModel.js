const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)  NULL,
      email VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(25)  NULL,
      password VARCHAR(255) NOT NULL,   
      address VARCHAR(500)  NULL,
      verificationstatus BOOLEAN NULL,
      userstatus BOOLEAN NULL,
      otp VARCHAR(6) NULL,
      expireAt TIMESTAMP NULL
    )
  `;
    await db.execute(query);
};

const insertUser = async (name, email, hashedPassword, phonenumber, address, verificationstatus) => {
    const query = "INSERT INTO users(name, email, password, phonenumber, address,  verificationstatus) VALUE(?,?,?,?,?,?)";
    const [result] = await db.execute(query, [name, email, hashedPassword, phonenumber, address, verificationstatus]);
    return result.insertId;
};

const getUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows;
};

const updateUserOtp = async (id, otp, expireAt) => {
    const expireTime = new Date(expireAt).toISOString().slice(0, 19).replace("T", " ");
    const query = "UPDATE users SET otp=?,expireAt=? WHERE id = ?";
    const [result] = await db.execute(query, [otp, expireTime, id]);
    return result.affectedRows;
};

const getUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

const updateUserVerificationStatus = async (id, verifcationstatus) => {
    const query = "UPDATE users SET verificationstatus=? WHERE id = ?";
    const [result] = await db.execute(query, [verifcationstatus, id]);
    return result.affectedRows;
};

const updateUserStatus = async (id, userstatus) => {
    const query = "UPDATE users SET userstatus=? WHERE id = ?";
    const [result] = await db.execute(query, [userstatus, id]);
    return result.affectedRows;
};

const updateUserPassword = async (password, id) => {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await db.execute(query, [password, id]);
    return result.affectedRows;
};

module.exports = {
    createTable,
    insertUser,
    getUserByEmail,
    updateUserOtp,
    getUserById,
    updateUserVerificationStatus,
    updateUserPassword,
    updateUserStatus
};
