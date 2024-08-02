// src/routes/admin.routes.js
const AdminController = require('../controller/admin.controller');

module.exports = (app) => {
  app.post('/admin', AdminController.createAdmin);
  app.post('/admin/login', AdminController.loginAdmin);
  app.post('/admin/sub-admin', AdminController.createSubAdmin);
  app.patch('/admin/sub-admin/:uuid', AdminController.editSubAdmin);
  app.get('/admin/sub-admin/:uuid', AdminController.getSubAdminDetails);
  app.put('/admin/:uuid/privileges', AdminController.updatePrivileges);
  app.patch('/admin/privileges/:uuid/status', AdminController.updatePrivilegeStatus);
};
