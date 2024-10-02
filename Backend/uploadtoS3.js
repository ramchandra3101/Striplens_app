import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const s3client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

export const uploadToS3 = async (filePath, imageName) => {
  const folderName = path.basename(imageName, path.extname(imageName));
  const bucketName = process.env.BUCKET_NAME; // Replace with your S3 bucket name

  const filecontent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: `${folderName}/${path.basename(filePath)}`, // File name you want to save as in S3
    Body: filecontent,
    contentType: "image/jpeg",
  };

  try {
    const command = await new PutObjectCommand(params);
    const data = await s3client.send(command);
    console.log(
      `File uploaded successfully at https://${bucketName}.s3.amazonaws.com/${params.Key}`
    );

    return `https://${bucketName}.s3.amazonaws.com/${params.Key}`; // Return the S3 URL of the uploaded image
  } catch (error) {
    console.error(`Error uploading to S3: ${error.message}`);
    throw error; // Rethrow to handle it in server.js
  }
};
export default uploadToS3;
