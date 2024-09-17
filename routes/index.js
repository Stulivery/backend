var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');7
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
router.post('/confirmemail', UserController.sendEmail);
router.post('/validateotp', UserController.validateOtp);
router.post('/updatepassword', UserController.updatePassword);
router.post('/updateuserstatus', UserController.updateUserstatus);

module.exports = router;
