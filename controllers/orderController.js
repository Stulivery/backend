const orderModel = require('../models/orderModel');

const insertOrderController = async (req, res) => {
	const userID = req.userId
	await orderModel.createTable();
	function generateRandom7DigitNumber() {
        return Math.floor(Math.random() * 9000000) + 1000000;
    };
    const orderID = `STU${gen.erateRandom7DigitNumber()}`;
	const { orderStatus, receiverLocation, userLocation, paymentMethod, amount } = req.body;
	const checkExistOrder = await orderModel.getOrderByID(orderID)
	if(checkExistOrder) {
		return res.status(403).json({message: 'Order Not available'})
	}
	else {
		try {
	        const getOrderID = await orderModel.insertOrder(userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount);
	        if(!getOrderID) {
	            return res.status(201).json({ id: null, message: "failed" });
	        }
	        res.status(201).json({ id: getOrderID, orderID: orderID , message: "successful" });
	    } catch (error) {
	        console.log(error);
	    }
	}
}

const updateOrderController = async (req, res) => {
	const userID = req.userId;
	const { orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount, deliveryManID} = req.body;
	try{
        const updateorder=await orderModel.updateOrder(userID, orderID, orderStatus, receiverLocation, userLocation, paymentMethod, amount, deliveryManID);
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
	const userID = req.userId;
	try {
		const getrows = await orderModel.getAllOrders(userID);
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