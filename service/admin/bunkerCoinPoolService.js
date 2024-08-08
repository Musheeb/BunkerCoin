const prisma = require('../../config/prismaClient');

// Service to get the last AdminBunkerCoinPool entry
const getLastBunkerPoolEntry = async () => {
    return prisma.AdminBunkerCoinPool.findFirst({
        orderBy: { createdAt: 'desc' }
    });
};

// Service to create a new AdminBunkerCoinPool entry
const createBunkerPoolEntry = async (adminId, bunkercoin, newTotalBunkercoin) => {
    return prisma.AdminBunkerCoinPool.create({
        data: {
            adminId,
            bunkercoin,
            totalBunkercoin: newTotalBunkercoin,
        }
    });
};


// Service to get paginated and searchable bunker pool list with admin names
const getBunkerPoolList = async (page, pageSize, searchQuery) => {
    const skip = (page - 1) * pageSize;

    // Prisma query with pagination, search, and relation to Admin table
    const bunkerPoolList = await prisma.AdminBunkerCoinPool.findMany({
        skip: skip,
        take: pageSize,
        where: {
            admin: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive',
                }
            }
        },
        include: {
            admin: {
                select: {
                    username: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Get the total count for pagination
    const totalCount = await prisma.adminBunkerCoinPool.count({
        where: {
            admin: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive',
                }
            }
        }
    });

    //  // Transform the results to include adminName at the top level
    //  const transformedList = bunkerPoolList.map(entry => ({
    //     id: entry.id,
    //     uuid: entry.uuid,
    //     adminId: entry.adminId,
    //     bunkercoin: entry.bunkercoin,
    //     totalBunkercoin: entry.totalBunkercoin,
    //     createdAt: entry.createdAt,
    //     updatedAt: entry.updatedAt,
    //     adminName: entry.admin.name,  // Extract admin name at the top level
    // }));

    return {
        bunkerPoolList,
        totalCount
    };
};


// Service to get the total sum of all bunkercoin
const getTotalBunkerCoin = async () => {
    // Calculate the total sum of bunkercoin
    const totalBunkerCoin = await prisma.adminBunkerCoinPool.aggregate({
        _sum: {
            bunkercoin: true
        }
    });

    // Calculate TotalBunkerPoolBalance
    const totalBunkerPool = totalBunkerCoin._sum.bunkercoin;

    return {
        totalBunkerPool,
    };
};

module.exports = {
    getLastBunkerPoolEntry,
    createBunkerPoolEntry,
    getBunkerPoolList,
    getTotalBunkerCoin
};
