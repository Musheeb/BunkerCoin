const prisma = require('../../config/prismaClient');


const findCurrentBunkerCoinRate = async () => {
    try {
        const currentRate = await prisma.bunkerMarketDev.findFirst({
            where: {
                status: 'CURRENT',
            },
            select: {
                rate: true,
            },  
            orderBy: {
                id: 'desc',
            },
        });
        if (currentRate) {
            // Ensure rate is formatted to 5 decimal places
            currentRate.rate = parseFloat(currentRate.rate).toFixed(6);
        }

        return currentRate;
    } catch (error) {
        console.error('Error in findCurrentBunkerCoinRate:', error);
        throw error;  // Throwing the error to be handled by the controller
    }
};





const getCoinPurchaseBreakdownService = async (requestedCoins) => {
    try {
        // Find the current status row
        const currentEntry = await prisma.bunkerMarketDev.findFirst({
            where: {
                status: 'CURRENT',
            },
            select: {
                coinsUnsold: true,
                rate: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        if (!currentEntry) {
            throw new Error('No current status found');
        }

        const breakdown = [];
        let remainingCoins = BigInt(requestedCoins);

        // Helper function to safely handle BigInt comparison
        const minBigInt = (a, b) => a < b ? a : b;

        // Allocate coins from the current status
        if (remainingCoins > 0n && currentEntry.coinsUnsold > 0n) {
            const coinsToAllocate = minBigInt(remainingCoins, currentEntry.coinsUnsold);
            breakdown.push({
                rate: parseFloat(currentEntry.rate).toFixed(5),
                coins: coinsToAllocate.toString(),
            });
            remainingCoins -= coinsToAllocate;
        }

        // If there are still coins needed, find the next rate entries
        if (remainingCoins > 0n) {
            const nextEntries = await prisma.bunkerMarketDev.findMany({
                where: {
                    status: 'UNSOLD',
                },
                select: {
                    coinsUnsold: true,
                    rate: true,
                },
                orderBy: {
                    id: 'asc', // ascending to get the next rates
                },
            });

            for (const entry of nextEntries) {
                if (remainingCoins <= 0n) break;

                const coinsToAllocate = minBigInt(remainingCoins, entry.coinsUnsold);
                breakdown.push({
                    rate: parseFloat(entry.rate).toFixed(5),
                    coins: coinsToAllocate.toString(),
                });
                remainingCoins -= coinsToAllocate;

                // Stop if all requested coins are allocated
                if (remainingCoins <= 0n) break;
            }
        }

        // Filter out entries with zero coins
        const filteredBreakdown = breakdown.filter(entry => BigInt(entry.coins) > 0n);

        return filteredBreakdown;
    } catch (error) {
        console.error('Error in getCoinPurchaseBreakdown:', error);
        throw error;
    }
};



const getCoinPurchaseBreakdownServiceC = async (requestedCoins) => {
    try {
        // Fetch all relevant rates ordered by status and rate
        const rates = await prisma.bunkerMarketDev.findMany({
            where: {
                coinsUnsold: {
                    gt: 0,
                },
                status: {
                    in: ['CURRENT', 'UNSOLD'], // Filter for relevant statuses
                },
            },
            select: {
                rate: true,
                coinsUnsold: true,
                status: true,
            },
            orderBy: [
                { status: 'asc' }, // 'CURRENT' first, then 'UNSOLD'
                { rate: 'asc' },
            ],
        });

        console.log(rates)

        let remainingCoins = Number(requestedCoins);
        const breakdown = [];

        // Process rates to provide the required coin breakdown
        for (const rate of rates) {
            if (remainingCoins <= 0) break;

            const coinsToUse = Math.min(remainingCoins, Number(rate.coinsUnsold));
            remainingCoins -= coinsToUse;

            breakdown.push({
                rate: rate.rate.toFixed(5), // Ensure rate has 5 decimal places
                coins: coinsToUse.toString(),
            });
        }

        if (remainingCoins > 0) {
            // If there are still remaining coins that couldn't be fulfilled
            return { message: 'Not enough coins available to fulfill the request.' };
        }

        return breakdown;
    } catch (error) {
        console.error('Error in getCoinPurchaseBreakdown:', error);
        throw error;
    }
};





module.exports = {
    findCurrentBunkerCoinRate,
    getCoinPurchaseBreakdownService
};
