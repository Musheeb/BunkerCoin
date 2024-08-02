const multer = require('multer');
const aws = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


// const getBucketName = (imageType) => {
//     switch (imageType) {
//         case 'category':
//             return process.env.AWS_CATEGORIES_IMAGES_BUCKET;
//         case 'store':
//             return process.env.AWS_STORE_IMAGES_BUCKET;
//         case 'offer':
//             return process.env.OFFER_IMAGES_BUCKET;
//         default:
//             throw new Error('Invalid image type');
//     }
// };

const getFolderName = (imageType) => {
    switch (imageType) {
        case 'user':
            return 'user/';
        default:
            throw new Error('Invalid image type');
    }
};

const upload = (imageType) => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET,
            metadata: function (req, file, cb) {
                console.log(file)
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const folderName = getFolderName(imageType);
                const uniqueKey = folderName + Date.now() + '-' + file.originalname;
                cb(null, uniqueKey);
            },
        }),
    });
};



module.exports = upload;






