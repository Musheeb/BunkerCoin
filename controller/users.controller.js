const UserService = require('../service/users/usersService');
const { UserSchema } = require('../modules/validation/users');
const { validate } = require('../modules/validation/validate');
const Tools = require("../modules/tools");

const registration = async (req, res, next) => {
    try {
        validate(UserSchema.POST, req.body);
        const body = req.body;
        const otp = Tools.generate6DigitOTP();
        const token = Tools.generateJWT('15m', { email: req.body.email });
        body.token = {
            accessToken: token,
            fcmToken: null
        };
        body.otp = otp;
        const user = await UserService.create(body);
        res.send(user);
        // if (user) //send OTP for verification. 
    } catch (error) {
        next(error);
    }
}
exports.registration = registration;

const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.find();
        res.send(users);
    } catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;

const getUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserService.get(id);
        if (!user) throw new Error("User details not found");
        res.send(user);
    } catch (error) {
        next(error);
    }
};
exports.getUserDetails = getUserDetails;

const uploadImage = async (req, res, next) => {
    try {
        res.send({
            file: req.file,
            message: "Image uploaded successfully."
        });
    } catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;