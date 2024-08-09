const { bunkerMaster, getCurrentBunkerCoinRate, getCoinPurchaseBreakdown } = require('../controller/bunkerCoinMaster.controller');


module.exports = (app) => {
    app.post('/bunkerMaster', bunkerMaster);
    app.get('/current-bunkercoin-rate', getCurrentBunkerCoinRate);
    app.get('/coin-purchase-breakdown', getCoinPurchaseBreakdown);
};
