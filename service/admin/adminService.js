// src/services/adminService.js
const prisma = require('../../config/prismaClient');
const bcryptUtil = require('../../modules/bcryptUtil');
const jwt = require('jsonwebtoken');
const nodeMailer = require('../../modules/notifications/emails/sendEmail');
const Tools = require('../../modules/tools');


const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};



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
    const otp = generateOtp();

    // Save the OTP in the database
    await prisma.admin.update({
      where: { email: data.email },
      data: { otp: otp }
    });

    // For User
    const userRecipient = data.email;
    const userMailBody = Tools.mailBody('Your OTP for Login', otp, admin);
    await nodeMailer.sendEmail(userRecipient, userMailBody, 'admin');

    return { message: 'OTP sent to email' };
  } else {
    throw new Error('Invalid email or password');
  }
};


// Verify OTP and issue token
const verifyOtp = async (email, otp) => {
  const admin = await prisma.admin.findUnique({
    where: { email: email }
  });

  if (!admin || admin.otp !== parseInt(otp, 10)) { // Convert OTP to integer for comparison
    throw new Error('Invalid OTP');
  }

  const token = jwt.sign(
    { uuid: admin.uuid, email: admin.email, isSuper: admin.isSuper },
    process.env.JWT_SECRET, // Define this in your .env file
    { expiresIn: '8h' } // Token expiration time
  );

  // Save the token in the database
  await prisma.admin.update({
    where: { email: email },
    data: { token: token, otp: null } // Clear OTP after successful verification
  });

  return { admin, token };
};


// Resend OTP
const resendOtp = async (email) => {
  const admin = await prisma.admin.findUnique({
    where: { email: email }
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  const otp = generateOtp(); // Generate OTP as integer

  // Save the OTP in the database
  await prisma.admin.update({
    where: { email: email },
    data: { otp: otp }
  });

  const userRecipient = admin.email;
  const userMailBody = {
    subject: 'Resend OTP for Login',
    context: {
      otp: otp, // Generate OTP dynamically
      name: admin.username
    }
  };
  await nodeMailer.sendEmail(userRecipient, userMailBody, 'user');

  return { message: 'OTP resent to email' };
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


const changePassword = async (uuid, oldPassword, newPassword, otp) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { uuid: uuid }
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    if (!otp) {
      const isPasswordValid = await bcryptUtil.comparePassword(oldPassword, admin.password);
      if (!isPasswordValid) {
        throw new Error('Invalid old password');
      }

      // Generate OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP and new password temporarily in the database
      await prisma.admin.update({
        where: { uuid: uuid },
        data: {
          otp: generatedOtp,
          //tempPassword: await bcryptUtil.hashPassword(newPassword)
        }
      });

      // Send OTP to admin's email
      // await sendOtpEmail(admin.email, generatedOtp);

      return { message: 'OTP sent to email' };
    } else {
      if (admin.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      // Update password with the new password
      const updatedAdmin = await prisma.admin.update({
        where: { uuid: uuid },
        data: {
          password: newPassword,
          otp: null,
          //tempPassword: null
        }
      });

      return updatedAdmin;
    }
  } catch (err) {
    throw err;
  }
};

const logoutAdmin = async (uuid) => {
  try {
    await prisma.admin.update({
      where: { uuid: uuid },
      data: { token: null }
    });
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
  updateAdminStatus,
  changePassword,
  logoutAdmin,
  verifyOtp,
  resendOtp
};
