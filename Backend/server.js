import { exec } from "child_process"; // Import exec from child_process
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bodyparser from "body-parser";
import uploadToS3 from "./uploadtoS3.js";
import multer from "multer";
import adoberemove from "./adoberemove.js";
import fs from "fs"; // Use fs.promises for async operations
import { pipeline } from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const streamPipeline = promisify(pipeline);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext); // Save with original extension
  },
});

const upload = multer({ storage: storage });
app.use(bodyparser.json());

// API endpoint to receive the image URI from mobile app
app.post("/processImage", upload.single("image"), async (req, res) => {
  const imageUri = req.file.path;
  console.log("imageUri: " + imageUri);

  if (!imageUri) {
    return res.status(400).json({ error: "Invalid image URI" });
  }
  try {
    const processedImageUri = await processImage(imageUri);
    console.log("processedImageUri: " + processedImageUri);
    res.json({ success: true, processedImageUri });
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    res.status(500).json({ error: "Error processing image" });
  }
});

const processImage = async (imageUri) => {
  try {
    // Step 1: Uploading image to S3
    const s3ImageURL = await uploadToS3(imageUri, path.basename(imageUri));
    console.log("s3ImageURL: " + s3ImageURL);

    //Step 2: Using S3 URL to remove Background of Image

    const nobgURI = await adoberemove(s3ImageURL);

    const folderName = path.basename(s3ImageURL, path.extname(s3ImageURL));
    const localFolderPath = path.join(__dirname, "downloads", folderName);
    const localImagePath = path.join(localFolderPath, path.basename(nobgURI));

    await fs.promises.mkdir(localFolderPath, { recursive: true });

    try {
      const response = await fetch(nobgURI);
      console.log("nobgURI: " + nobgURI);
      console.log("Response status: ", response.status);

      if (!response.ok) {
        throw new Error(`Failed to download image from S3 URL: ${nobgURI}`);
      }

      const contentType = response.headers.get("content-type");
      console.log("Response Content-Type: ", contentType);

      if (contentType.startsWith("image/")) {
        const localImagePath = path.join(
          __dirname,
          "downloads",
          folderName,
          path.basename(nobgURI)
        );

        // Pipe binary data to the file stream with proper binary encoding
        const writeStream = fs.createWriteStream(localImagePath, {
          encoding: "binary",
        });
        await streamPipeline(response.body, writeStream);

        console.log("Image saved successfully to:", localImagePath);
      } else {
        const jsonResponse = await response.text();
        console.log("Received JSON response instead of image: ", jsonResponse);
        throw new Error("Expected image, but got JSON data.");
      }
    } catch (error) {
      throw new Error(`Error downloading image: ${error.message}`);
    }

    // Create the directory if it doesn't exist

    // Passing this URI to the Python script
    const { croppedImagePath, plotImagePath } = await callPythonScript(
      localImagePath
    );

    const croppedImageS3Url = await uploadToS3(
      croppedImagePath,
      `${folderName}/${path.basename(imageUri)}`
    );
    const plotImageS3Url = await uploadToS3(
      plotImagePath,
      `${folderName}/${path.basename(imageUri)}`
    );

    return {
      originalImage: s3ImageURL,
      croppedImage: croppedImageS3Url,
      plotImage: plotImageS3Url,
    };
  } catch (error) {
    console.error(`Error processing image from server.js: ${error.message}`);
    throw error;
  }
};

const callPythonScript = async (processedImageURI) => {
  const pythonScriptPath = path.join(__dirname, "output.py");

  return new Promise((resolve, reject) => {
    exec(
      `python3 ${pythonScriptPath} ${processedImageURI}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
          reject(new Error(stderr));
          return;
        }

        const [croppedImagePath, plotImagePath] = stdout.trim().split("\n");
        resolve({ croppedImagePath, plotImagePath });
      }
    );
  });
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
