import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream";
import { promisify } from "util";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();

const streamPipeline = promisify(pipeline);

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

// Function to remove the background from an image and return the processed image
async function RemoveBackground(s3ImageURL) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key not found in .env file");
  }

  const isUrl =
    s3ImageURL.startsWith("http://") || s3ImageURL.startsWith("https://");
  if (!isUrl) {
    throw new Error("Invalid S3 URL provided");
  }

  let localImagePath;
  let imageFileName;
  let __filename;
  let __dirname;
  let downloadsDir;
  let folderName;
  let imageFolderPath;

  try {
    const response = await fetch(s3ImageURL);
    if (!response.ok) {
      throw new Error(`Failed to download image from S3 URL: ${s3ImageURL}`);
    }

    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
    downloadsDir = path.join(__dirname, "downloads");

    imageFileName = path.basename(s3ImageURL);
    folderName = imageFileName.split(".")[0]; // Folder name is the image name without extension
    imageFolderPath = path.join(downloadsDir, folderName);

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    if (!fs.existsSync(imageFolderPath)) {
      fs.mkdirSync(imageFolderPath);
    }

    // Create a local file path to store the downloaded image

    // Extract the file name from the S3 URL
    localImagePath = path.join(imageFolderPath, imageFileName);

    await streamPipeline(response.body, fs.createWriteStream(localImagePath));
  } catch (error) {
    throw new Error(`Error downloading image: ${error.message}`);
  }

  // Create form-data with the image file
  const form = new FormData();
  form.append("image_file", fs.createReadStream(localImagePath));

  try {
    const response = await fetch(
      "https://clipdrop-api.co/remove-background/v1",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error: ${errorData.error || "Failed to remove background"}`
      );
    }

    // Define output file path (same as input but with '_no_bg' suffix)
    const outputFileName = imageFileName.replace(
      path.extname(imageFileName),
      `_no_bg${path.extname(imageFileName)}`
    );
    const outputFilePath = path.join(imageFolderPath, outputFileName);

    // Save the API result locally
    const fileStream = fs.createWriteStream(outputFilePath);
    await streamPipeline(response.body, fileStream);
    // Step 3: Upload the processed image back to the same S3 folder

    const folderNameonS3 = path.basename(s3ImageURL, path.extname(s3ImageURL)); // Extract folder name from the image name
    const s3BucketName = "striplens";

    const uploadParams = {
      Bucket: s3BucketName,
      Key: `${folderNameonS3}/${outputFileName}`, // Same folder, different file name
      Body: fs.createReadStream(outputFilePath),
      ContentType: "image/jpeg", // Adjust based on your image type
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    const uploadResponse = await s3Client.send(uploadCommand);

    // Return the S3 URL of the processed image

    const processedImageS3Url = `https://${s3BucketName}.s3.amazonaws.com/${folderNameonS3}/${outputFileName}`;

    return processedImageS3Url;
  } catch (error) {
    console.error(
      `Error processing image from removeBackground: ${error.message}`
    );
    throw error;
  }
}

export default RemoveBackground;

// Define output file path (same as input but with '_no_bg' suffix)
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);

//     //Create a public folder in the Backend directory if doesnt exist
//     const publicDir = path.join(__dirname, "public");
//     if (!fs.existsSync(publicDir)) {
//       fs.mkdirSync(publicDir);
//     }

//     //Create a subfolder with input image name to store out from API inside public without extension

//     const subfolder = path.basename(imagePath, path.extname(imagePath));
//     const imageFolder = path.join(publicDir, subfolder);
//     if (!fs.existsSync(imageFolder)) {
//       fs.mkdirSync(imageFolder);
//     }

//     //Defining the output file path inside the subfolder with '_no_bg_' suffix"
//     const outputFilePath = path.join(
//       imageFolder,
//       `${subfolder}_no_bg${path.extname(imagePath)}`
//     );

//     // Save the image directly to the file system
//     const fileStream = fs.createWriteStream(outputFilePath);
//     response.body.pipe(fileStream);

//     return new Promise((resolve, reject) => {
//       fileStream.on("finish", () => {
//         resolve(outputFilePath);
//       });
//       fileStream.on("error", (err) => {
//         reject(err);
//       });
//     });
//   } catch (error) {
//     console.error(`Error processing image from clipdrop: ${error.message}`);
//   }
// }
// export default RemoveBackground;
