const express = require("express");
const router = express.Router();
const controller = require("../controller/parentController");
// const verifytoken = require("../middleware/jwtVerification");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
router.post("/signup", controller.parentSignupController);
router.post("/login", controller.parentLoginController);
// router.post("/update", verifytoken, controller.parentUpdateController);
// router.post("/emailstatus", verifytoken, controller.parentEmailStatus);
// router.post("/sendotp", verifytoken, controller.parentSendEmail);
// router.post("/verifyotp", verifytoken, controller.validateOtp);

module.exports = router;
