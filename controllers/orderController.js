const orderModel = require('../models/orderModel');

const insertOrderController = async (req, res) => {
	const userID = req.userId
	await orderModel.createTable();
	function generateRandom7DigitNumber() {
        return Math.floor(Math.random() * 9000000) + 1000000;
    };
    const orderID = `STU${generateRandom7DigitNumber()}`;
	const { deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo } = req.body;
	const checkExistOrder = await orderModel.getOrderByID(orderID);
	if(checkExistOrder) {
		return res.status(403).json({message: 'Error try again'});
	}
	else {
		try {
	        const getOrderID = await orderModel.insertOrder(userID, orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo);
	        if(!getOrderID) {
	            return res.status(201).json({ id: null, message: "failed" });
	        }
	        res.status(201).json({ orderID: orderID , message: "successful" });
	    } catch (error) {
	        console.log(error);
	    }
	}
};

const updateOrderController = async (req, res) => {
	const userID = req.userId;
	const { orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo, deliveryManID} = req.body;
	try {
        const updateorder=await orderModel.updateOrder(orderID, deliveryphonenumber, deliverycontactname, orderStatus, deliveryLocation, pickupLocation, paymentMethod, additionalinfo, deliveryManID);
        if (updateorder=== 0) {
            res.status(403).json({ message: 'Order not found' });
        } else {
            res.status(201).json({ message: 'Order updated', orderID: orderID });
        }
    } catch (error) {
        res.status(404).json({ message: 'Failed to update order' });
    }

};

const getAllUserOrderController = async (req, res) => {
	const userID = req.userId;
	try {
		const getrows = await orderModel.getAllUserOrders(userID);
	    if (!getrows) {
	        res.status(403).json({ message: "Orders not found" });
	        return
	    }
	    res.status(201).json({ orders: getrows, message: 'successful' })
	} catch (error) {
		console.log(error);
	}
};

const getAllDeliveryOrderController = () => {
	const { deliveryManID } = req.body;
	try {

	} catch (error) {
		console.log(error);
	}
}

const getAllOrders = async (req,res) => {
	try {
		const getrows = await orderModel.getAllOrders();
		if(!getrows) {
			return res.status(403).json({ message: "Orders not found" });
		}
		res.status(201).json({ orders: getrows, message: 'successful' })
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	insertOrderController,
	updateOrderController,
	getAllUserOrderController,
	getAllDeliveryOrderController,
	getAllOrders
}