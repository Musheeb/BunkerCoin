const { bunkerMaster } = require('../controller/bunkerCoinMaster.controller');


module.exports = (app) => {
    app.post('/bunkerMaster', bunkerMaster);

};
