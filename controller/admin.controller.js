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
    res.status(200).json(admin);
  } catch (error) {
    next(error);
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
