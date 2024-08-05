const prisma = require('../config/prismaClient');

module.exports.generateReferral = async () => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789@#_&';
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }
};

module.exports.ifReferralUsedAlready = async (code) => {
    return await prisma.user.findUnique({
        where: {
            referralCode: code
        }
    });
};

module.exports.referralCode = async () => {
    let code = await generateReferral();
    while (await ifReferralUsedAlready(code)) {
        code = code = generateReferral();
    }
    if (!code) throw new Error("Code not generated");
    return code;
};

// const generatedReferralCode = referralCode();
// console.log(`Random 8-digit referral code: ${generatedReferralCode}`);