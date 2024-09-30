import RemoveBackground from "./RemoveBackground.js";
import { exec } from "child_process"; // Import exec from child_process
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  exec(`python3 ${pythonScriptPath} ${imagePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Python script stderr: ${stderr}`);
      return;
    }
    console.log(`Python script output: ${stdout}`);
  });
};

const imagePath =
  "/Users/rcyerramsetti/Documents/WebDev_Local/Striplens_app/Backend/public/strip.png";
processImage(imagePath);

// import { exec } from "child_process";
// import path from "path";

// const processImage = (imagePath) => {
//   // Use the path to the Python executable in your virtual environment
//   const pythonExecutable =
//     "/Users/rcyerramsetti/Documents/WebDev_Local/Striplens_app/myenv/bin/python"; // Update this path
//   const pythonScriptPath = path.join(process.cwd(), "output.py");
//   const command = `${pythonExecutable} ${pythonScriptPath} ${imagePath}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing Python script: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Python script stderr: ${stderr}`);
//       return;
//     }

//     // Expecting two lines of output from the Python script
//     const [croppedImagePath, plotImagePath] = stdout.trim().split("\n");
//     console.log(`Cropped image path: ${croppedImagePath}`);
//     console.log(`Plot image path: ${plotImagePath}`);
//   });
// };

// const imagePath =
//   "/Users/rcyerramsetti/Documents/WebDev_Local/Striplens_app/Backend/public/20240929_144041_no_bg.jpg";
// processImage(imagePath);
