const { text } = require("body-parser");

const encryptAlgorithm = async (text) => {
    const key = process.env.SECRET_KEY;
    function encrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) + 3);
        }
        return result;
    }
    return encrypt(text, key);
};

const decryptAlgorithm = async (text) => {
    const key = process.env.SECRET_KEY;
    function encrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) - 3);
        }
        return result;
    }
    return encrypt(text, key);
};

module.exports = {
    encryptAlgorithm,
    decryptAlgorithm
}