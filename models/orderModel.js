const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT NULL
    )
  `;
  await db.execute(query);
};

const insertOrder = async (userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount) => {
  const orderTimeDate = new Date().getTime();
    const query = "INSERT INTO orders(userID, orderID, orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount) VALUE(?,?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [userID, orderID, orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount]);
    return result.insertId;
};

const getOrderByID = async (orderID) => {
  const query = "SELECT * FROM orders WHERE orderID = ?";
  const [rows] = await db.execute(query, [orderID]);
  return rows[0];
};

const updateOrder = async (userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount, deliveryManID) => {
  const orderTimeDate = new Date().getTime();
  const query = 'UPDATE orders SET orderStatus=?, orderTimeDate=?, receiverLocation=?, userLocation=?, paymentMethod=?, amount=?, deliveryManID=? WHERE orderID=?';
  const [result] = await db.execute(query, [orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount, deliveryManID, orderID]);
  return result.affectedRows;
};

const getAllOrders = async (userID) => {
  const query = 'SELECT * FROM orders WHERE userID = ?';
  const [rows] = await db.execute(query, [userID]);
  return rows;
};

module.exports = {
  createTable,
  insertOrder,
  updateOrder,
  getAllOrders,
  getOrderByID

};