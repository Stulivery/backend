const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID VARCHAR(200) NULL,
        orderID VARCHAR(200) NULL,
        orderStatus VARCHAR(200) NULL,
        orderTimeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deliveryphonenumber VARCHAR(25) NULL,
        additionalinfo VARCHAR(500) NULL,
        pickupLocation VARCHAR(200),
        deliveryLocation VARCHAR(200) NUll,
        paymentMethod VARCHAR(25),
        deliverycontactname VARCHAR(200),
        deliveryguyID VARCHAR(25)
    )
  `;
    await db.execute(query);
};

const createTable2 = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS orderdetails(
            id INT AUTO_INCREMENT PRIMARY KEY,
            orderID VARCHAR(25)
        )
    `
}

const insertOrder = async (userID, orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo) => {
    const orderTimeDate = new Date().getTime();
    const query = "INSERT INTO orders(userID, orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo) VALUE(?,?,?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [userID, orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo]);
    return result.insertId;
};

const getOrderByID = async (orderID) => {
    const query = "SELECT * FROM orders WHERE orderID = ?";
    const [rows] = await db.execute(query, [orderID]);
    return rows[0];
};

const updateOrder = async (orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo, deliveryguyID) => {
    const query = "UPDATE orders SET deliveryphonenumber=?, deliverycontactname=?, orderStatus=?, deliveryLocation=?, pickupLocation=?, paymentMethod=?, additionalinfo=?, deliveryguyID=? WHERE orderID=?";
    const [result] = await db.execute(query, [deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo,deliveryguyID,orderID]);
    return result.affectedRows;
};

const getAllUserOrders = async (userID) => {
    const query = "SELECT * FROM orders WHERE userID = ?";
    const [rows] = await db.execute(query, [userID]);
    return rows;
};

const getAllOrders = async () => {
    const query = "SELECT * FROM orders";
    const [rows] = await db.execute(query);
    return rows;
}

module.exports = {
    createTable,
    insertOrder,
    updateOrder,
    getAllUserOrders,
    getOrderByID,
    getAllOrders,
    createTable2
};
