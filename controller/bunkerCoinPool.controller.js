const { getLastBunkerPoolEntry, createBunkerPoolEntry, getBunkerPoolList, getTotalBunkerCoin } = require('../service/admin/bunkerCoinPoolService');

const addBunkerPool = async (req, res) => {
    try {
        const { adminId, bunkercoin } = req.body;

        // Get the last entry's totalBunkercoin value using the service
        const lastEntry = await getLastBunkerPoolEntry();

        // Calculate the new totalBunkercoin
        const lastTotalBunkercoin = lastEntry ? lastEntry.totalBunkercoin : 0;
        const newTotalBunkercoin = lastTotalBunkercoin + bunkercoin;

        // Create a new entry using the service
        const newEntry = await createBunkerPoolEntry(adminId, bunkercoin, newTotalBunkercoin);

        res.status(200).send({
            success: "success",
            message: 'Bunker coin pool entry created successfully',
            data: newEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

const getBunkerPool = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, search = '' } = req.query;

        // Use the service to get the paginated and searchable list
        const { bunkerPoolList, totalCount } = await getBunkerPoolList(parseInt(page), parseInt(pageSize), search);

        res.status(200).send({
            success: "success",
            data: bunkerPoolList,
            pageInfo: {
                page: parseInt(page),
                limit: parseInt(pageSize),
                totalPages: Math.ceil(totalCount / pageSize),
                totalCount: totalCount
            }
        });
    } catch (error) {
        res.status(400).send({
            success: "failed",
            message: 'Something went wrong',
            error: error.message
        });
    }
};


const getBunkerPoolSummary = async (req, res) => {
    try {
        // Get the total bunker coin value
        const totalBunkerCoin = await getTotalBunkerCoin();
        const bunkerCoinBal = await getLastBunkerPoolEntry();

        const totalBunkerPoolSpent = totalBunkerCoin.totalBunkerPool - bunkerCoinBal.totalBunkercoin;

        res.status(200).send({
            success: "success",
            totalBunkerCoin: totalBunkerCoin.totalBunkerPool,
            bunkerCoinBal: bunkerCoinBal.totalBunkercoin,
            totalBunkerPoolSpent
        });
    } catch (error) {
        res.status(500).send({
            success: "failed",
            message: 'Something went wrong',
            error: error.message
        });
    }
};


module.exports = {
    addBunkerPool,
    getBunkerPool,
    getBunkerPoolSummary
};
