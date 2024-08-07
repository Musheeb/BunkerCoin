const UserService = require('../service/users/usersService');
const UserSchema = require('../modules/validation/users');

const registration = async (req, res, next) => {
    try {
        const body = req.body;
        const user = await UserService.create(body);
        res.send(user);
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