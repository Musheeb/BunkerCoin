// src/services/privilegeMasterService.js
const prisma = require('../../config/prismaClient');

const getAllPrivileges = async () => {
  const privileges = await prisma.privilegeMaster.findMany();
  return privileges;
};

const createPrivilege = async (data) => {
  const privilege = await prisma.privilegeMaster.create({
    data: {
      // uuid: prisma.uuid(),
      name: data.name,
      description: data.description,
      status: data.status
    }
  });
  return privilege;
};

const updatePrivilege = async (uuid, data) => {
  const existingPrivilege = await prisma.privilegeMaster.findUnique({
    where: { uuid: uuid }
  });

  if (!existingPrivilege) {
    throw new Error('Privilege not found');
  }

  const privilege = await prisma.privilegeMaster.update({
    where: { uuid: uuid },
    data: {
      name: data.name,
      description: data.description
    }
  });
  return privilege;
};


const deletePrivilege = async (uuid) => {
  await prisma.privilegeMaster.delete({
    where: { uuid: uuid }
  });
};

module.exports = {
  getAllPrivileges,
  createPrivilege,
  updatePrivilege,
  deletePrivilege
};