const db = require("../database/db");
const createTable = async () => {
    //Name,Phonenumber,email,Password,Address,GenderSelectOption,StudentId,roleSelectOption
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT  NULL,
      email VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(25) NOT  NULL,
      password VARCHAR(50) NOT NULL,   
      address VARCHAR(500)  NULL,
      studentid VARCHAR(50) NULL,
      role VARCHAR(25),
      gender VARCHAR(25) NULL,
      verificationstatus BOOLEAN NULL,
      userstatus VARCHAR(25) NULL,
      pin VARCHAR(6) NULL,
      bvn VARCHAR(15) NULL,
      nin VARCHAR(15) NULL,
      createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await db.execute(query);
};
//Name,Phonenumber,email,Password,Address,GenderSelectOption,StudentId,roleSelectOption
const insertUser = async (Name,Phonenumber,email,Password,Address,GenderSelectOption,StudentId,roleSelectOption,verificationstatus,userstatus) => {
    const query = "INSERT INTO users(name,phonenumber, email, password, address,studentid,role, gender,verificationstatus,userstatus) VALUE(?,?,?,?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [Name,Phonenumber,email,Password,Address,StudentId,roleSelectOption,GenderSelectOption,verificationstatus,userstatus]);
    return result.insertId;
};

const getUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0];
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

const updateUserDeliveryID = async (id, deliveryManID) => {
    console.log(id, deliveryManID);
    const query = "UPDATE users SET deliveryManID=? WHERE id=?";
    const [result] = await db.execute(query, [deliveryManID, id]);
    return result.affectedRows;
};


const updateUserType = async (id, userstatus,role) => {
    const query = "UPDATE users SET userstatus=?, role=? WHERE id = ?";
    const [result] = await db.execute(query, [userstatus, role, id]);
    return result.affectedRows;
};

const updateUserPassword = async (password, id) => {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await db.execute(query, [password, id]);
    return result.affectedRows;
};

const updateUser = async (id, gender,address,phonenumber) => {
    const query = 'UPDATE users SET gender = ?, address= ?,phonenumber=? WHERE id = ?';
    const [result] = await db.execute(query, [gender,address,phonenumber, id]);
    return result.affectedRows;
};

const getDeliveryMAnID = async (deliveryManID) => {
  const query = "SELECT * FROM users WHERE deliveryManID = ?";
  const [rows] = await db.execute(query, [deliveryManID]);
  return rows[0];
};

const updateVerificationDetails = async (userID, bvn, nin) => {
    const query = 'UPDATE users SET bvn=?, nin=? WHERE id=?';
    const [result] = await db.execute(q7, [bvn, nin, userID]);
    return result.affectedRows;
}

const updateUSerPin = async (userID, pin) => {
    const query = 'UPDATE users SET pin=? WHERE id=?';
    const [result] = await db.execute(query, [pin, userID]);
    return result.affectedRows;
}

module.exports = {
    createTable,
    insertUser,
    getUserByEmail,
    updateUserOtp,
    getUserById,
    updateUserVerificationStatus,
    updateUser,
    updateUserPassword,
    updateUserType,
    updateUserDeliveryID,
    getDeliveryMAnID,
    updateVerificationDetails,
    updateUSerPin
};
