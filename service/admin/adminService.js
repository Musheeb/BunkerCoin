// src/services/adminService.js
const prisma = require('../../config/prismaClient');
const bcryptUtil = require('../../modules/bcryptUtil');


const createAdmin = async (data) => {
  const hashedPassword = await bcryptUtil.hashPassword(data.password);
  const admin = await prisma.admin.create({
    data: {
      uuid: prisma.uuid(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isSuper: data.isSuper || false,
      privileges: {
        create: data.privileges.map(privilege => ({
          uuid: prisma.uuid(),
          privilegeMasterUuid: privilege.privilegeMasterUuid,
          status: privilege.status
        }))
      }
    },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });
  return admin;
};

const loginAdmin = async (data) => {
  console.log(data)
  const admin = await prisma.admin.findUnique({
    where: { email: data.email },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });

  if (admin && await bcryptUtil.comparePassword(data.password, admin.password)) {
    return admin;
  } else {
    throw new Error('Invalid email or password');
  }
};

const createSubAdmin = async (data) => {
  const hashedPassword = await bcryptUtil.hashPassword(data.password);
  const subAdmin = await prisma.admin.create({
    data: {
      //uuid: prisma.uuid(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isSuper: false,
      privileges: {
        create: data.privileges.map(privilege => ({
          //uuid: prisma.uuid(),
          privilegeMasterUuid: privilege.privilegeMasterUuid,
          status: privilege.status
        }))
      }
    },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });
  return subAdmin;
};

const editSubAdmin = async (uuid, data) => {
  const hashedPassword = data.password ? await bcryptUtil.hashPassword(data.password) : undefined;
  const subAdmin = await prisma.admin.update({
    where: { uuid: uuid },
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      privileges: {
        deleteMany: {},
        create: data.privileges.map(privilege => ({
         // uuid: prisma.uuid(),
          privilegeMasterUuid: privilege.privilegeMasterUuid,
          status: privilege.status
        }))
      }
    },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });
  return subAdmin;
};

const getSubAdminDetails = async (uuid) => {
  const subAdmin = await prisma.admin.findUnique({
    where: { uuid: uuid },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });
  return subAdmin;
};


const getAllSubAdmins = async (search = '', page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const subAdmins = await prisma.admin.findMany({
    where: {
      isSuper: false,
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    },
    skip: offset,
    take: limit,
    select: {
      uuid: true,
      username: true,
      email: true,
      status: true,
      privileges: {
        include: {
          privilegeMaster: true,
        },
      },
    },
  });

  const totalSubAdmins = await prisma.admin.count({
    where: {
      isSuper: false,
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    },
  });

  return {
    subAdmins,
    totalPages: Math.ceil(totalSubAdmins / limit),
    currentPage: page,
  };
};

const updatePrivileges = async (uuid, privileges) => {
  const admin = await prisma.admin.update({
    where: { uuid: uuid },
    data: {
      privileges: {
        deleteMany: {},
        create: privileges.map(privilege => ({
          //uuid: prisma.uuid(),
          privilegeMasterUuid: privilege.privilegeMasterUuid,
          status: privilege.status
        }))
      }
    },
    include: {
      privileges: {
        include: {
          privilegeMaster: true
        }
      }
    }
  });
  return admin;
};



const updatePrivilegeStatus = async (uuid, status) => {
  const privilege = await prisma.adminPrivilege.findUnique({
    where: { uuid: uuid },
  });

  if (!privilege) {
    throw new Error('Privilege not found');
  }

  const updatedPrivilege = await prisma.adminPrivilege.update({
    where: { uuid: uuid },
    data: {
      status: status,
    },
  });

  return updatedPrivilege;
};

module.exports = {
  createAdmin,
  loginAdmin,
  createSubAdmin,
  editSubAdmin,
  getSubAdminDetails,
  getAllSubAdmins,
  updatePrivileges,
  updatePrivilegeStatus
};
