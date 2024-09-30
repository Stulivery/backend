var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const OrderController = require('../controllers/orderController');
const ImageController = require('../controllers/imageUploadController');
const WalletController = require('../controllers/walletController');
const verifytoken=require('../middleware/jwtVerification');
const verifytokenotp=require('../middleware/jwtotpverification')
const uploadimage = require('../middleware/receiveImage');
const uploadprofilepic = require('../middleware/receiveProfilePic');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//verifyEmail
router.post('/auth/sendotp',UserController.generateOtp);
router.post('/auth/verifyemail',verifytokenotp,UserController.verifyEmail);
//users route

router.post('/auth/register', UserController.userRegistration);
router.post('/auth/login', UserController.userLogin);
router.post('/auth/confirmemail', verifytoken, UserController.sendEmail);
router.post('/auth/validateotp', verifytoken, UserController.validateOtp);
router.post('/update/updatepassword', verifytoken, UserController.updatePassword);
router.post('/update/updateuserstatus', verifytoken, UserController.updateUserType);
router.post('/update/updateuserdetails', verifytoken, UserController.updateUserDetails);
router.post('/update/updateuserpin', verifytoken, UserController.updateUserPin);
router.post('/update/updateverificationdetails', verifytoken, UserController.updateVerificationDetails);
router.post('/fetch/fetchuserdetails', verifytoken, UserController.getUserDetails);
//orders route
router.post('/order/insertorder', verifytoken, OrderController.insertOrderController);
router.post('/order/updateorder', verifytoken, OrderController.updateOrderController);
router.post('/order/getalluserorders', verifytoken, OrderController.getAllUserOrderController);
router.post('/order/getallorders', verifytoken, OrderController.getAllOrders)
//upload image
router.post('/upload/uploadimage', verifytoken, uploadimage, ImageController.uploadImageController);
router.post('/upload/profilepic', verifytoken, uploadprofilepic, ImageController.insertProfilePicController);
router.post('/fetch/profilepic', verifytoken, ImageController.getProfilePictureController);
//wallet route
router.post('/wallet/updatewalletdetails', verifytoken, WalletController.insertWalletDetailsController);
router.post('/wallet/getwalletdetails', verifytoken, WalletController.getWalletDetailController);
module.exports = router;