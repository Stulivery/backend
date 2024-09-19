const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT,
      orderID VARCHAR(255) NULL,  
      orderStatus VARCHAR(50) NULL,
      orderTimeDate TIMESTAMP NULL,
      receiverLocation VARCHAR(200) NULL,
      userLocation VARCHAR(200) NULL,
      paymentMethod VARCHAR(200),
      amount INT,
      deliveryManID VARCHAR(200)

    )
  `;
    await db.execute(query);
};

const insertOrder = async (userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount, deliveryManID) => {
  const orderTimeDate = new Date().getTime();
    const query = "INSERT INTO orders(userID, orderID, orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount, deliveryManID) VALUE(?,?,?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [userID, orderID, orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount, deliveryManID]);
    return result.insertId;
};

const getOrderByID = async (orderID) => {
  const query = "SELECT * FROM orders WHERE orderID = ?";
  const [rows] = await db.execute(query, [orderID]);
  return rows[0];
}

const updateOrder = async (userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount, deliveryManID) => {
  console.log(orderID)
  const orderTimeDate = new Date().getTime();
  const query = 'UPDATE orders SET orderID=?, orderStatus=?, orderTimeDate=?, receiverLocation=?, userLocation=?, paymentMethod=?, amount=?, deliveryManID=? WHERE orderID=?';
  const [result] = await db.execute(query, [userID, orderStatus, orderTimeDate, receiverLocation, userLocation, paymentMethod, amount, deliveryManID, orderID]);
  return result.affectedRows;
};

const getAllOrders = async (userID) => {
  const query = 'SELECT * FROM orders WHERE userID = ?';
  const [rows] = await db.execute(query, [userID]);
  return rows;
}

module.exports = {
  createTable,
  insertOrder,
  updateOrder,
  getAllOrders,
  getOrderByID

}