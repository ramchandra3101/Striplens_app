import RemoveBackground from "./RemoveBackground.js";
import { exec } from "child_process"; // Import exec from child_process
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyparser from "body-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyparser.json());

//API endpoint to receive the image URI from mobile app

app.post("/processImage", async (req, res) => {
  const { imageUri } = req.body;
  if (!imageUri) {
    return res.status(400).json({ error: "Invalid image URI" });
  }
  try {
    const { processedImageUri, plotImagePath } = await processImage(imageUri);
    res.json({ success: true, processedImageUri, plotImagePath });
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
    res.status(500).json({ error: "Error processing image" });
  }
});

const processImage = async (imagePath) => {
  try {
    const processedImageURI = await RemoveBackground(imagePath);
    // console.log(`Processed Image URI: ${processedImageURI}`);;
    //  passING this URI to the Python script
    await callPythonScript(processedImageURI);

    return processedImageURI;
  } catch (error) {
    console.error(`Error processing image: ${error.message}`);
  }
};

const callPythonScript = async (imagePath) => {
  const pythonScriptPath = path.join(__dirname, "output.py");

  return new Promise((resolve, reject) => {
    exec(
      `python3 ${pythonScriptPath} ${imagePath}`,
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
        console.log(`Cropped image path: ${croppedImagePath}`);
        console.log(`Plot image path: ${plotImagePath}`);
        resolve({ processedImageURI: croppedImagePath, plotImagePath });
      }
    );
  });
};
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
