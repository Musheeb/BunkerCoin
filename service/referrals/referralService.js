const prisma = require('../../config/prismaClient');

const get = async (id) => {
    let result = await prisma.referral.findUnique({
        where: {
            uuid: id
        }
    });
    return result;
};
exports.get = get;

const find = async (query) => {
    let result = await prisma.referral.findMany(query);
    return result;
};
exports.find = find;

const create = async (data) => {
    let result = await prisma.referral.create({
        data: data
    });
    return result;
};
exports.create = create;

const patch = async (id, data) => {
    let result = await prisma.referral.update({
        where: { uuid: id },
        data: data
    });
    return result;
};
exports.patch = patch;

const findByEntity = async (data) => {
    let result = await prisma.referral.findUnique({
        where: data
    });
    return result;
};
exports.findByEntity = findByEntity;

const createReferralTree = async (referringUser, referredUser) => {
    try {
        const referral = await this.create({
            parentId: referringUser.uuid,
            userId: referredUser.uuid,
        });
        return referral;
    } catch (error) {
        throw error;
    }
};
exports.createReferralTree = createReferralTree;