const { addBunkerPool, getBunkerPool, getBunkerPoolSummary } = require('../controller/bunkerCoinPool.controller');
const authenticateJWT = require('../middlewares/auth'); 
const ensureSuperAdmin = require('../middlewares/ensureSuperAdmin');

module.exports = (app) => {
    app.post('/addBunkerPool', addBunkerPool);
    app.get('/bunkerPool', getBunkerPool);
    app.get('/bunkerPoolSummary', getBunkerPoolSummary);
};
