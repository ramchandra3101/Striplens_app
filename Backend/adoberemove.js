import dotenv from "dotenv";
import fetch from "node-fetch";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
dotenv.config();

const s3client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

async function adoberemove(s3ImageURL) {
  const apikey = process.env.ADOBE_API_KEY;
  const accesstoken = process.env.ADOBE_ACCESS_TOKEN;
  if (!apikey || !accesstoken) {
    throw new Error("API key or Access token is missing");
  }

  const isUrl =
    s3ImageURL.startsWith("http://") || s3ImageURL.startsWith("https://");
  if (!isUrl) {
    throw new Error("Invalid image URL");
  }

  const requestBody = {
    input: {
      href: s3ImageURL,
      storage: "external",
    },
    output: {
      href: s3ImageURL.replace(
        path.extname(s3ImageURL),
        `_no_bg${path.extname(s3ImageURL)}`
      ),
      storage: "external",
    },
  };

  try {
    const response = await fetch("https://image.adobe.io/sensei/cutout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "x-api-key": apikey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.log(response);
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.error}`);
    }

    const outputFilename = requestBody.output.href;

    const foldernameonS3 = path.basename(s3ImageURL, path.extname(s3ImageURL));
    const s3bucketName = "striplens";

    const uploadParams = {
      Bucket: s3bucketName,
      Key: `${foldernameonS3}/${path.basename(outputFilename)}`,
      Body: response.body,
      ContentType: "image/jpeg",
    };

    const upload = new Upload({
      client: s3client,
      params: uploadParams,
    });
    const uploadResponse = await upload.done();

    const proccessedImageURL = `https://${s3bucketName}.s3.us-east-2.amazonaws.com/${foldernameonS3}/${path.basename(
      outputFilename
    )}`;

    return proccessedImageURL;
  } catch (error) {
    console.error(`Error removing background: ${error.message}`);
    throw error; // Rethrow to handle it in server.js
  }
}
export default adoberemove;

// const testImageUpload =
//   "https://striplens.s3.amazonaws.com/8851f78b264ae253a4dc5c406abb2e1b/8851f78b264ae253a4dc5c406abb2e1b";
// (async () => {
//   try {
//     const result = await adoberemove(testImageUpload);
//     console.log("RESULTURL:", result);
//   } catch (error) {
//     console.error("Error in path:", error.message);
//   }
// })();
