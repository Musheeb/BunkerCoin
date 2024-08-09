const prisma = require('../../config/prismaClient');
const jwt = require('jsonwebtoken');

const get = async (id) => {
    let result = await prisma.user.findUnique({
        where: {
            uuid: id
        }
    });
    return result;
};
exports.get = get;

const find = async (query) => {
    let result = await prisma.user.findMany(query);
    return result;
};
exports.find = find;

const create = async (data) => {
    let result = await prisma.user.create({
        data: data
    });
    return result;
};
exports.create = create;

const patch = async (id, data) => {
    let result = await prisma.user.update({
        where: { uuid: id },
        data: data
    });
    return result;
};
exports.patch = patch;

const findByEntity = async (data) => {
    let result = await prisma.user.findUnique({
        where: data
    });
    return result;
};
exports.findByEntity = findByEntity;

const findOne = async (data) => {
    let result = await prisma.user.findFirstOrThrow({
        where: data
    });
    if (!result) return false;
    return result;
};
exports.findOne = findOne;

const verifyJwtOnly = async (req, token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) return true;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error(req.t('sessionExpired'))
        }
        throw error;
    }
};
exports.verifyJwtOnly = verifyJwtOnly;

const validateJWT = function (tokenArray, token) {
    try {
        if (tokenArray.length === 0 || !token) {
            throw new Error('tokenArray or token not found')
        }
        return tokenArray.find(t => t.accessToken === token);
    } catch (error) {
        throw error;
    }
};
exports.validateJWT = validateJWT;

const deleteTempJWTAndUpdateNewJWT = async (uuid, tokenToDelete, tokenToAdd) => {
    try {
        const user = await prisma.user.findUnique({
            where: { uuid: uuid },
            select: {
                token: true,
                loginCount: true
            }
        });
        if (!user) throw new Error(req.t('userNotFound'));
        const filteredTokens = user.token.filter(t => t.accessToken !== tokenToDelete);
        filteredTokens.push({
            accessToken: tokenToAdd,
            fcmToken: null
        });
        const updatedUser = await prisma.user.update({
            where: { uuid: uuid },
            data: {
                token: filteredTokens,
                loginCount: user.loginCount + 1,
                lastLoginTimestamp: new Date(),
                isEmailVerified: true
            }
        });

        const projectedData = await prisma.user.findFirst({
            where: { uuid: updatedUser.uuid },
            select: {
                id: true,
                uuid: true,
                username: true,
                email: true,
                referralCode: true,
                referredBy: true,
                bcWallet: true,
                comissionWallet: true,
                profilePicture: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                isEmailVerified: true,
                loginCount: true,
                lastLoginTimestamp: true,
                token: true
            }
        });

        return {
            id: projectedData.id,
            uuid: projectedData.uuid,
            username: projectedData.username,
            email: projectedData.email,
            referralCode: projectedData.referralCode,
            referredBy: projectedData.referredBy,
            bcWallet: projectedData.bcWallet,
            comissionWallet: projectedData.comissionWallet,
            profilePicture: projectedData.profilePicture,
            createdAt: projectedData.createdAt,
            updatedAt: projectedData.updatedAt,
            status: projectedData.status,
            isEmailVerified: projectedData.isEmailVerified,
            loginCount: projectedData.loginCount,
            lastLoginTimestamp: projectedData.lastLoginTimestamp,
            token: projectedData.token[0]?.accessToken,
            fcmToken: projectedData.token[0]?.fcmToken,
        }

    } catch (error) {
        throw error;
    }
};
exports.deleteTempJWTAndUpdateNewJWT = deleteTempJWTAndUpdateNewJWT;

const verifyReferredByCode = async (referralCode) => {
    const isValidReferral = await prisma.user.findFirstOrThrow({
        where: {
            referralCode: referralCode
        }
    });
    // console.log(isValidReferral);
    if (isValidReferral) return true;
    return false;
};
exports.verifyReferredByCode = verifyReferredByCode;

const getProjectedData = async (userUuid, dataObjToInclude) => {
    return await prisma.user.findFirst({
        where: { uuid: userUuid },
        select: dataObjToInclude
    });
};
exports.getProjectedData = getProjectedData;

const updateJwtAndOTP = async (userUuid, tokenToUpdate, otpToUpdate) => {
    await prisma.user.update({
        where: { uuid: userUuid },
        data: {
            token: [
                {
                    accessToken: tokenToUpdate,
                    fcmToken: null
                }
            ],
            otp: otpToUpdate
        }
    });
    return
};
exports.updateJwtAndOTP = updateJwtAndOTP;