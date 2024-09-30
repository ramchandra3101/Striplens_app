import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

// Function to remove the background from an image and return the processed image
async function RemoveBackground(imagePath) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key not found in .env file");
  }

  // Create form-data with the image file
  const form = new FormData();
  form.append("image_file", fs.createReadStream(imagePath));

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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    //Create a public folder in the Backend directory if doesnt exist
    const publicDir = path.join(__dirname, "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    //Create a subfolder with input image name to store out from API inside public without extension

    const subfolder = path.basename(imagePath, path.extname(imagePath));
    const imageFolder = path.join(publicDir, subfolder);
    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder);
    }

    //Defining the output file path inside the subfolder with '_no_bg_' suffix"
    const outputFilePath = path.join(
      imageFolder,
      `${subfolder}_no_bg${path.extname(imagePath)}`
    );

    // Save the image directly to the file system
    const fileStream = fs.createWriteStream(outputFilePath);
    response.body.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on("finish", () => {
        resolve(outputFilePath);
      });
      fileStream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
  }
}
export default RemoveBackground;
