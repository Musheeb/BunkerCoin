const prisma = require('../config/prismaClient');

const bunkerMaster = async (req, res) => {
    try {
        // Retrieve data from request body
        const data = req.body;

        // Perform the bulk insert
        const result = await prisma.bunkerMarketDev.createMany({
            data: data,
            skipDuplicates: true, // Optional: Skips duplicate entries
        });

        res.status(200).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};

module.exports = {
    bunkerMaster
};