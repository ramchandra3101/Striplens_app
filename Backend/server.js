import RemoveBackground from "./RemoveBackground.js";
import { exec } from "child_process"; // Import exec from child_process
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bodyparser from "body-parser";
import uploadToS3 from "./uploadtoS3.js";
import multer from "multer";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: "uploads/" });

app.use(bodyparser.json());

//API endpoint to receive the image URI from mobile app

app.post("/processImage", upload.single("image"), async (req, res) => {
  const imageUri = req.file.path;
  console.log("imageUri: " + imageUri);

  if (!imageUri) {
    return res.status(400).json({ error: "Invalid image URI" });
  }
  try {
    const processedImageUri = await processImage(imageUri);
    res.json({ success: true, processedImageUri });
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    res.status(500).json({ error: "Error processing image" });
  }
});

const processImage = async (imageUri) => {
  try {
    //Step:1 uploading image to S3
    const s3ImageURL = await uploadToS3(imageUri, path.basename(imageUri));

    // Step:2 Usinhg S# URL to remove Background of Image
    const nobgURI = await RemoveBackground(s3ImageURL);

    const folderName = path.basename(s3ImageURL, path.extname(s3ImageURL));

    const localImagePath = path.join(
      __dirname,
      "downloads",
      folderName,
      path.basename(nobgURI)
    );

    //  passING this URI to the Python script
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

        // Expecting two lines of output from the Python script
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
