const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255)  NULL,
    lastName VARCHAR(255)  NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(500)  NULL,
    otp VARCHAR(6) NULL,
    expireAt TIMESTAMP NULL
    )`;
    await db.execute(query);
};

const insertUser = async (email, password) => {
    const query =
        "INSERT INTO users (email, password) VALUES (?,?,?)";
    const [result] = await db.execute(query, [
        email,
        password,
    ]);
    return result.insertId;
};

const deleteUser = async (id) => {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
};

const updateUser = async (
    id,
    firstName,
    lastName,
    address
) => {
    const query =
        "UPDATE users SET firstName = ?, lastName = ?, address=? WHERE id = ?";

    const [result] = await db.execute(query, [
        firstName,
        lastName,
        address,
        id,
    ]);
    return result.affectedRows;
};

const updateUserOtp = async (id, otp, expireAt) => {
    const expireTime = new Date(expireAt)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    const query = "UPDATE users SET otp=?, expireAt=? WHERE id = ?";
    const [result] = await db.execute(query, [otp, expireTime, id]);
    return result.affectedRows;
};

const getUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};

const getAllUsers = async () => {
    const query = "SELECT * FROM users";
    return await db.execute(query);
};

module.exports = {
    createTable,
    insertUser,
    deleteUser,
    updateUser,
    getUserById,
    getAllUsers,
    getUserByEmail,
    updateUserOtp,
};
