// src/routes/privilege.routes.js
const PrivilegeController = require('../controller/privilege.controller');

module.exports = (app) => {
    app.get('/privileges', PrivilegeController.getAllPrivileges);
    app.post('/privileges', PrivilegeController.createPrivilege);
    app.patch('/privileges/:uuid', PrivilegeController.updatePrivilege);
    app.delete('/privileges/:uuid', PrivilegeController.deletePrivilege);
};
