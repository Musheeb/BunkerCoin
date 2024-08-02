// src/controllers/privilege.controller.js
const PrivilegeMasterService = require('../service/admin/privilegeMasterService');

const getAllPrivileges = async (req, res, next) => {
    try {
      const privileges = await PrivilegeMasterService.getAllPrivileges();
      res.status(200).json(privileges);
    } catch (error) {
      next(error);
    }
  };
  
  const createPrivilege = async (req, res, next) => {
    try {
      const privilege = await PrivilegeMasterService.createPrivilege(req.body);
      res.status(201).json(privilege);
    } catch (error) {
      next(error);
    }
  };
  
  const updatePrivilege = async (req, res, next) => {
    try {
      const privilege = await PrivilegeMasterService.updatePrivilege(req.params.uuid, req.body);
      res.status(200).json(privilege);
    } catch (error) {
      if (error.message === 'Privilege not found') {
        res.status(404).json({ error: 'Privilege not found' });
      } else {
        next(error);
      }
    }
  };
  
  const deletePrivilege = async (req, res, next) => {
    try {
      await PrivilegeMasterService.deletePrivilege(req.params.uuid);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getAllPrivileges,
    createPrivilege,
    updatePrivilege,
    deletePrivilege
  };