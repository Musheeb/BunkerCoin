const prisma = require('../config/prismaClient');
const { findCurrentBunkerCoinRate, getCoinPurchaseBreakdownService } = require('../service/admin/bunkerCoinMasterService')

const bunkerMaster = async (req, res) => {
    try {
        // Retrieve data from request body
        const data = req.body;

        // Perform the bulk insert
        const result = await prisma.bunkerMarketDev.createMany({
            data: data,
            //skipDuplicates: true, // Optional: Skips duplicate entries
        });

        res.status(200).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};

const getCurrentBunkerCoinRate = async (req, res) => {
    try {
        const currentRate = await findCurrentBunkerCoinRate();

        if (!currentRate) {
            return res.status(400).send({
                success: "failed",
                message: 'No current rate found'
            });
        }

        return res.status(200).send({
            success: "success",
            currentRate: currentRate.rate
        });

    } catch (error) {
        return res.status(500).send({
            success: "failed",
            message: 'Something went wrong',
            error: error.message
        });
    }
};

const getCoinPurchaseBreakdown = async (req, res) => {
    const { coins } = req.body; // Assume coins are passed as a query parameter

    if (!coins || isNaN(coins)) {
        return res.status(400).send({
            success: "failed",
            message: 'Invalid or missing coins parameter'
        });
    }

    try {
        const breakdown = await getCoinPurchaseBreakdownService(BigInt(coins));

        if (breakdown.length === 0) {
            
            return res.status(400).send({
                success: "failed",
                message: 'Not enough unsold coins available'
            });
        }

        res.status(200).send({
            success: "success",
            breakdown: breakdown
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
    bunkerMaster,
    getCurrentBunkerCoinRate,
    getCoinPurchaseBreakdown
};