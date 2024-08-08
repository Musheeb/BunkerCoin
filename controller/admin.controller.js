// src/controllers/admin.controller.js
const AdminService = require('../service/admin/adminService');

const createAdmin = async (req, res, next) => {
  try {
    const admin = await AdminService.createAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const admin = await AdminService.loginAdmin(req.body);
    return res.status(200).send({
      response: "success",
      message: req.t("otpSend"),
      token:admin.token
  });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await AdminService.verifyOtp(email, otp);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await AdminService.resendOtp(email);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


const createSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await AdminService.createSubAdmin(req.body);
    res.status(201).json(subAdmin);
  } catch (error) {
    next(error);
  }
};

const editSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await AdminService.editSubAdmin(req.params.uuid, req.body);
    res.status(200).json(subAdmin);
  } catch (error) {
    if (error.message === 'SubAdmin not found') {
      res.status(404).json({ error: 'SubAdmin not found' });
    } else {
      next(error);
    }
  }
};

const getSubAdminDetails = async (req, res, next) => {
  try {
    const subAdmin = await AdminService.getSubAdminDetails(req.params.uuid);
    res.status(200).json(subAdmin);
  } catch (error) {
    next(error);
  }
};

const getAllSubAdmins = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const result = await AdminService.getAllSubAdmins(search, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePrivileges = async (req, res, next) => {
  try {
    const updatedAdmin = await AdminService.updatePrivileges(req.params.uuid, req.body.privileges);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    if (error.message === 'Admin not found') {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      next(error);
    }
  }
};

const updatePrivilegeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { uuid } = req.params;
    const updatedPrivilege = await AdminService.updatePrivilegeStatus(uuid, status);
    res.status(200).json(updatedPrivilege);
  } catch (error) {
    if (error.message === 'Privilege not found') {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const updateAdminStatus = async (req, res) => {
  const { uuid } = req.params;
  const { status } = req.body;

  try {
    const updatedAdmin = await AdminService.updateAdminStatus(uuid, status);
    res.json(updatedAdmin);
  } catch (err) {
    if (err.message === 'Status must be a boolean') {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};


const changePassword = async (req, res) => {
  const { uuid } = req.params;
  const { oldPassword, newPassword, otp } = req.body;

  try {
    const result = await AdminService.changePassword(uuid, oldPassword, newPassword, otp);
    res.json(result);
  } catch (err) {
    if (err.message === 'Invalid old password' || err.message === 'Invalid OTP' || err.message === 'Admin not found') {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const logoutAdmin = async (req, res) => {
  try {
    await AdminService.logoutAdmin(req.user.uuid);
    res.sendStatus(200); // OK
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
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
