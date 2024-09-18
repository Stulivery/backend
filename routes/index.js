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
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
router.post('/confirmemail', verifytoken, UserController.sendEmail);
router.post('/validateotp', verifytoken, UserController.validateOtp);
router.post('/updatepassword', verifytoken, UserController.updatePassword);
router.post('/updateuserstatus', verifytoken, UserController.updateUserType);
router.post('/updateuserdetails', verifytoken, UserController.updateUserDetails);
//orders route
router.post('/insertorder', verifytoken, OrderController.insertOrderController);
router.post('/updateorder', verifytoken, OrderController.updateOrderController);
router.post('/getallorders', verifytoken, OrderController.getAllOrderController);

module.exports = router;