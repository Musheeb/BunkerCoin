const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
  credentials: fromEnv(), // or use your existing credentials setup
  region: process.env.AWS_REGION,
});

const getPresignedUrl = async (key) => {
  const bucketName = process.env.AWS_BUCKET;

  // Set up the parameters for the S3 getSignedUrl
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 3600, // URL expiration time in seconds (adjust as needed)
  };

  try {
    // Use getSignedUrl to generate the pre-signed URL
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: params.Expires });
    // console.log('Generated pre-signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};



module.exports = getPresignedUrl;
