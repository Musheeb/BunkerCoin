const prisma = require('../config/prismaClient');

const generateReferral = async () => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789@#_&';
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }
    return code;
};
exports.generateReferral = generateReferral;

const ifReferralUsedAlready = async (code) => {
    return await prisma.user.findFirst({
        where: {
            referralCode: code
        }
    });
};
exports.ifReferralUsedAlready = ifReferralUsedAlready;

const referralCode = async () => {
    let code = await generateReferral();
    while (await ifReferralUsedAlready(code)) { // Await the function call
        code = await generateReferral(); // Await the function call
    }
    if (!code) throw new Error("Code not generated");
    return code;
};
exports.referralCode = referralCode;
