import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const url = "https://api.picsart.io/tools/1.0/upscale/ultra";
const apiKey = process.env.PICSART_API_KEY;
const sourceImagePath =
  "/Users/rcyerramsetti/Documents/WebDev_Local/Striplens_app/20240923_152033_no_bg.jpg";

const upscaleAndDownloadImage = async () => {
  const form = new FormData();
  form.append("image", fs.createReadStream(sourceImagePath));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Picsart-API-Key": apiKey,
        ...form.getHeaders(),
      },
      body: form,
    });
    const data = await response.json();

    if (data.data && data.data.url) {
      console.log("Image processed, downloading...");
      await downloadImage(data.data.url);
    } else {
      console.error("Unexpected response:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const downloadImage = async (resultUrl) => {
  try {
    const res = await fetch(resultUrl);
    const dest = fs.createWriteStream("./upscaled_image.jpg");
    res.body.pipe(dest);
    dest.on("finish", () => {
      console.log("Image downloaded and saved as upscaled_image.jpg");
    });
    dest.on("error", (err) => {
      console.error("Error saving the image:", err);
    });
  } catch (err) {
    console.error("Download error:", err);
  }
};

upscaleAndDownloadImage();
