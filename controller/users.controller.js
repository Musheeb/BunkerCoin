const UserService = require('../service/users/usersService');
const ReferralService = require('../service/referrals/referralService');
const nodemailer = require('../modules/notifications/emails/sendEmail');
const Tools = require("../modules/tools");
const { UserSchema } = require('../modules/validation/users');
const { validate } = require('../modules/validation/validate');
const { referralCode } = require('../modules/referralCode');

const registration = async (req, res, next) => {
    try {
        validate(UserSchema.POST, req.body);
        const body = req.body;
        // console.log(body);
        if (body.token) await UserService.verifyJwtOnly(req, body.token);
        if (body.referredBy && !(await UserService.verifyReferredByCode(body.referredBy)))
            throw new Error(req.t('userNotFoundWithTheGivenReferralCode'));
        if (!body.referredBy && !body.otp && (await UserService.find()).length > 0)
            throw new Error(req.t('referralCodeRequired'));
        if (body.otp && body.token) { //OTP verification flow.
            const user = await UserService.findByEntity({
                email: body.email
            });
            if (!user) throw new Error(req.t('userNotFound'));
            if (user.isEmailVerified) throw new Error(req.t('userAlreadyVerified'));
            const isTokenVerified = await UserService.validateJWT(user.token, body.token);
            if (!isTokenVerified) throw new Error(req.t('invalidToken'));
            if (user.otp !== parseInt(body.otp)) {
                return res.status(400).send({
                    response: "failed",
                    message: req.t('invalidOTP')
                });
            }
            const token = Tools.generateJWT("30d", { uuid: user.uuid });
            const result = await UserService.deleteTempJWTAndUpdateNewJWT(user.uuid, body.token, token);
            //Create referral tree data here.
            const referringUser = await UserService.findOne({
                referralCode: user.referredBy
            });
            await ReferralService.createReferralTree(referringUser, user);
            return res.status(200).send({
                response: 'success',
                message: req.t('otpVerifiedLoggingIn'),
                data: result
            });
        }
        //Below code only For the Fresh user (New Registration).
        const userDataIfAlreadyOnboarded = await UserService.findByEntity({ email: body.email });
        if (userDataIfAlreadyOnboarded && userDataIfAlreadyOnboarded.isEmailVerified) {
            return res.status(400).send({
                response: 'failed',
                message: req.t('userIsAlreadyRegistered')
            });
        }
        const otp = Tools.generate6DigitOTP();
        const token = Tools.generateJWT('15m', { email: req.body.email });
        if (userDataIfAlreadyOnboarded && !userDataIfAlreadyOnboarded.isEmailVerified) {
            await nodemailer.sendEmail(
                userDataIfAlreadyOnboarded.email,
                Tools.mailBody('Your OTP for Login', otp, userDataIfAlreadyOnboarded),
                'user'
            );
            await UserService.updateJwtAndOTP(userDataIfAlreadyOnboarded.uuid, token, otp);
            return res.status(400).send({
                response: 'failed',
                message: req.t('otpHasSendToEmail'),
                data: {
                    token: token,
                    otp: otp //Remove this after development.
                }
            });
        }
        const tokenArray = [
            {
                accessToken: token,
                fcmToken: null
            }
        ];
        body.token = tokenArray;
        body.otp = otp;
        body.referralCode = await referralCode();
        const user = await UserService.create(body);
        res.status(201).send({
            response: "success",
            message: req.t('otpHasSendToEmail'),
            data: {
                token: (await UserService.getProjectedData(user.uuid, { token: true })).token[0]?.accessToken,
                otp: otp
            }
        });
        //send OTP for verification. 
        if (user) await nodemailer.sendEmail(
            user.email,
            Tools.mailBody('Your OTP for Login', otp, user),
            'user'
        );
        return;
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