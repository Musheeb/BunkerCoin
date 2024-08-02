const prisma = require('../../config/prismaClient');

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