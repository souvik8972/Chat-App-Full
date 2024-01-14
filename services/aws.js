const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { extname } = require('path');
require('dotenv').config();
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const BUCKET_NAME=process.env.BUCKET_NAME
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId:AWS_ACCESS_KEY_ID,
    secretAccessKey:AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadToS3 = async (media, filename) => {
  try {
    const contentType = getContentType(filename);

    const uploadParams = {
      Bucket:BUCKET_NAME,
      Key: filename,
      Body: media,
      ACL: "public-read",
      ContentType: contentType,
    };

    const data = await s3Client.send(new PutObjectCommand(uploadParams));

    const publicUrl = `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// Function to determine content type based on file extension
function getContentType(filename) {
  const ext = extname(filename).toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.mp4':
      return 'video/mp4';
    case '.mp3':
      return 'audio/mp3';
    // Add more cases for other file types as needed
    default:
      return 'application/octet-stream'; // Default to binary data if content type is unknown
  }
}
