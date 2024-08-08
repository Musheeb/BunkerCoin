const prisma = require('../../config/prismaClient');
const jwt = require('jsonwebtoken');

const get = async (id) => {
    console.log(id);
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
        return await prisma.user.update({
            where: { uuid: uuid },
            data: {
                token: filteredTokens,
                loginCount: user.loginCount + 1,
                lastLoginTimestamp: new Date(),
                isEmailVerified: true
            }
        });

    } catch (error) {
        throw error;
    }
};
exports.deleteTempJWTAndUpdateNewJWT = deleteTempJWTAndUpdateNewJWT;