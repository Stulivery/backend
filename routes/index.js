var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const OrderController = require('../controllers/orderController');
const verifytoken=require('../middleware/jwtVerification');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//users route
router.post('/auth/register', UserController.userRegistration);
router.post('/auth/login', UserController.userLogin);
router.post('/auth/confirmemail', verifytoken, UserController.sendEmail);
router.post('/auth/validateotp', verifytoken, UserController.validateOtp);
router.post('/user/updatepassword', verifytoken, UserController.updatePassword);
router.post('/user/updateuserstatus', verifytoken, UserController.updateUserType);
router.post('/user/updateuserdetails', verifytoken, UserController.updateUserDetails);
//orders route
router.post('/order/insertorder', verifytoken, OrderController.insertOrderController);
router.post('/order/updateorder', verifytoken, OrderController.updateOrderController);
router.post('/order/getallorders', verifytoken, OrderController.getAllOrderController);

module.exports = router;