// src/services/adminService.js
const prisma = require('../../config/prismaClient');
const bcryptUtil = require('../../modules/bcryptUtil');
const jwt = require('jsonwebtoken');


const createAdmin = async (data) => {
  const hashedPassword = await bcryptUtil.hashPassword(data.password);
  const admin = await prisma.admin.create({
    data: {
      //uuid: prisma.uuid(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isSuper: data.isSuper || false,
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
    const token = jwt.sign(
      { uuid: admin.uuid, email: admin.email, isSuper: admin.isSuper },
      process.env.JWT_SECRET, // Define this in your .env file
      { expiresIn: '8h' } // Token expiration time
    );

    // Save the token in the database
    await prisma.admin.update({
      where: { email: data.email },
      data: { token: token }
    });

    return { admin, token };
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

const updateAdminStatus = async (uuid, status) => {
  if (typeof status !== 'boolean') {
    throw new Error('Status must be a boolean');
  }

  // Prepare the data to update
  const updateData = { status: status };
  if (!status) {
    // If deactivating, clear the token
    updateData.token = null;
  }

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { uuid: uuid },
      data: updateData
    });
    return updatedAdmin;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  createSubAdmin,
  editSubAdmin,
  getSubAdminDetails,
  getAllSubAdmins,
  updatePrivileges,
  updatePrivilegeStatus,
  updateAdminStatus
};
