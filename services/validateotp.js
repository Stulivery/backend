const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyOtpToken = (token, inputOtp) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err); // Debugging info
        // Reject the promise if token verification fails
        return reject({ auth: false, message: 'Failed to authenticate token.' });
      } else {
        // Check if the OTP from the decoded token matches the input OTP
        if (decoded.otp === inputOtp) {
          console.log('OTP is valid!');
          return resolve(true); // Resolve true if OTP is valid
        } else {
          console.log('OTP is invalid!');
          return resolve(false); // Resolve false if OTP doesn't match
        }
      }
    });
  });
};

module.exports = { verifyOtpToken };
