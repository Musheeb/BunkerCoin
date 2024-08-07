const jwt = require('jsonwebtoken');

const generate6DigitOTP = function () {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generate6DigitOTP = generate6DigitOTP;

/**
 * 
 * @param {String} duration - Expiration time eg, '8h'
 * @param {Object} dataToStore - What you want to store in the JWT. Pass JS object.
 * @returns 
 */
const generateJWT = function (duration, dataToStore) {
    const token = jwt.sign(
        dataToStore,
        process.env.JWT_SECRET, // Define this in your .env file
        { expiresIn: duration } // Token expiration time
    );
    return token;
};
exports.generateJWT = generateJWT;