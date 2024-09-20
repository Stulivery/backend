const db = require('../database/db');

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS images(
            id INT AUTO_INCREMENT PRIMARY KEY,
            userID VARCHAR(500) NULL,
            filename VARCHAR(500) NULL,
            profilepic VARCHAR(500) NULL,
        )
    `;
    await db.execute(query);
}

const insertImage = async (filename, userID) => {
    const query = 'INSERT INTO image(userID, filename) VALUES(?,?)'
    const [result] = await db.execute(query, [userID, filename]);
    return result.insertId;
}

const updateProfilePic = async (profilepic, userID) => {
    const query = 'UPDATE images SET profilepic=? WHERE userID=?'
    const [result] = await db.execute(query, [profilepic, userID]);
    return result[0].affectedRows;
}

const getImageById = async (userID) => {
    const query = "SELECT * FROM images WHERE userID= ?";
    const [rows] = await db.execute(query, [userID]);
    return rows[0];
};

module.exports={
    createTable,
    insertImage,
    updateProfilePic,
    getImageById
}
