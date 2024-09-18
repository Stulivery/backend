const orderModel = require('../models/orderModel');

const insertOrderController = async (req, res) => {
	const userId = req.userId
	await orderModel.createTable();
	const { packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, amount } = req.body;
	try {
        const orderId = await orderModel.insertOrder(packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, userId, amount);
        if(!orderId) {
            return res.status(201).json({ id: null, message: "failed" });
        }
        res.status(201).json({ id: orderId, message: "successful" });
    } catch (error) {
        console.log(error);
    }
}

const updateOrderController = async (req, res) => {
	const userId = req.userId;
	const { packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod , orderId, amount} = req.body;
	try{
        const updateorder=await orderModel.updateOrder(packagename, pickupaddress, name, pickupphonenumber, additionalinfo, deliveryaddress, contactname, deliveryphonenumber, paymentmethod, orderId, amount);
        if (updateorder=== 0) {
            res.status(403).json({ error: 'Order not found' });
        } else {
            res.status(201).json({ message: 'Order updated' });
        }
    } catch (error) {
        res.status(404).json({ error: 'Failed to update order' });
    }

}

const getAllOrderController = async (req, res) => {
	const userId = req.userId;
	try {
		const getrows = await orderModel.getAllOrders(userId);
	    if (!getrows) {
	        res.status(403).json({ message: "Orders not found" });
	        return
	    }
	    res.status(201).json({ orders: getrows, message: 'successful' })
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	insertOrderController,
	updateOrderController,
	getAllOrderController
}