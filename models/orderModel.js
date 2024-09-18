const db = require("../database/db");
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      packagename VARCHAR(255) NULL,  
      pickupaddress VARCHAR(500) NULL,
      name VARCHAR(255) NULL,
      pickupphonenumber VARCHAR(25) NULL,
      additionalinfo VARCHAR(500) NULL,
      deliveryaddress VARCHAR(500) NULL,
      contactname VARCHAR(255) NULL,
      deliveryphonenumber VARCHAR(25) NULL,
      paymentmethod VARCHAR(25) NULL,
      amount INT(25)
    )
  `;
    await db.execute(query);
};

const insertOrder = async (packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, userId,amount) => {
    const query = "INSERT INTO orders(packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, userId,amount) VALUE(?,?,?,?,?,?,?,?,?,?,?)";
    const [result] = await db.execute(query, [packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, userId,amount]);
    return result.insertId;
};

const updateOrder = async (packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, orderId, amount) => {
    const query = 'UPDATE orders SET packagename=?, pickupaddress=?, name=?, pickupphonenumber=?, additionalinfo=?, deliveryaddress=?, contactname=?, deliveryphonenumber=?, paymentmethod=?, amount=? WHERE id = ?';
    const [result] = await db.execute(query, [packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, amount, orderId]);
    return result.affectedRows;
};

const getAllOrders = async (userId) => {
  const query = 'SELECT * FROM orders WHERE userId = ?';
  const [rows] = await db.execute(query, [userId]);
  return rows;
}

module.exports = {
  createTable,
  insertOrder,
  updateOrder,
  getAllOrders

}