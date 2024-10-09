// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import { S3Client } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";
// import path from "path";
// dotenv.config();

// const s3client = new S3Client({
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   },
// });

// async function adoberemove(s3ImageURL) {
//   const apikey = process.env.ADOBE_API_KEY;
//   const accesstoken = process.env.ADOBE_ACCESS_TOKEN;
//   if (!apikey || !accesstoken) {
//     throw new Error("API key or Access token is missing");
//   }

//   const isUrl =
//     s3ImageURL.startsWith("http://") || s3ImageURL.startsWith("https://");
//   if (!isUrl) {
//     throw new Error("Invalid image URL");
//   }

//   const requestBody = {
//     input: {
//       href: s3ImageURL,
//       storage: "external",
//     },
//     output: {
//       href: s3ImageURL.replace(
//         path.extname(s3ImageURL),
//         `_no_bg${path.extname(s3ImageURL)}`
//       ),
//       storage: "external",
//     },
//   };

//   try {
//     const response = await fetch("https://image.adobe.io/sensei/cutout", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accesstoken}`,
//         "x-api-key": apikey,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });
//     if (!response.ok) {
//       console.log(response);
//       const errorData = await response.json();
//       throw new Error(`Error: ${errorData.error}`);
//     }

//     const outputFilename = requestBody.output.href;

//     const foldernameonS3 = path.basename(s3ImageURL, path.extname(s3ImageURL));
//     const s3bucketName = "striplens";

//     const uploadParams = {
//       Bucket: s3bucketName,
//       Key: `${foldernameonS3}/${path.basename(outputFilename)}`,
//       Body: response.body,
//       ContentType: "image/jpeg",
//     };

//     const upload = new Upload({
//       client: s3client,
//       params: uploadParams,
//     });
//     const uploadResponse = await upload.done();

//     const proccessedImageURL = `https://${s3bucketName}.s3.us-east-2.amazonaws.com/${foldernameonS3}/${path.basename(
//       outputFilename
//     )}`;

//     return proccessedImageURL;
//   } catch (error) {
//     console.error(`Error removing background: ${error.message}`);
//     throw error; // Rethrow to handle it in server.js
//   }
// }
// export default adoberemove;

// // const testImageUpload =
// //   "https://striplens.s3.amazonaws.com/8851f78b264ae253a4dc5c406abb2e1b/8851f78b264ae253a4dc5c406abb2e1b";
// // (async () => {
// //   try {
// //     const result = await adoberemove(testImageUpload);
// //     console.log("RESULTURL:", result);
// //   } catch (error) {
// //     console.error("Error in path:", error.message);
// //   }
// // })();

import dotenv from "dotenv";
import fetch from "node-fetch";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
import { PassThrough } from "stream";
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
    // Step 1: Call Adobe API to initiate background removal
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
      const errorData = await response.json();
      throw new Error(`Error from Adobe API: ${errorData.error}`);
    }

    // Step 2: Poll for Adobe job completion (optional if needed)
    const jobStatus = await response.json();
    const jobUrl = jobStatus._links?.self?.href;

    // If Adobe API returns an async job URL, check until job is complete
    if (jobUrl) {
      let isComplete = false;
      while (!isComplete) {
        const jobResponse = await fetch(jobUrl, {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "x-api-key": apikey,
          },
        });
        const jobData = await jobResponse.json();

        // Check for job completion status
        if (jobData.status === "succeeded") {
          isComplete = true;
        } else if (jobData.status === "failed") {
          throw new Error("Adobe background removal failed.");
        }
        // Wait a bit before polling again
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const outputFilename = requestBody.output.href;
    const foldernameonS3 = path.basename(s3ImageURL, path.extname(s3ImageURL));
    const s3bucketName = "striplens";

    // Step 3: Fetch the processed image (Adobe may return processed image directly)
    const processedResponse = await fetch(outputFilename);
    if (!processedResponse.ok) {
      throw new Error(`Failed to fetch processed image: ${outputFilename}`);
    }

    // Step 4: Stream the processed image to S3 using PassThrough stream
    const passThrough = new PassThrough();
    const uploadParams = {
      Bucket: s3bucketName,
      Key: `${foldernameonS3}/${path.basename(outputFilename)}`,
      Body: passThrough, // Stream the image data directly to S3
      ContentType: "image/jpeg",
    };

    const upload = new Upload({
      client: s3client,
      params: uploadParams,
    });

    // Pipe the image stream to the PassThrough stream
    processedResponse.body.pipe(passThrough);

    // Wait for the upload to S3 to complete
    await upload.done();

    // Construct the final URL of the processed image
    const processedImageURL = `https://${s3bucketName}.s3.us-east-2.amazonaws.com/${foldernameonS3}/${path.basename(
      outputFilename
    )}`;

    return processedImageURL;
  } catch (error) {
    console.error(`Error removing background: ${error.message}`);
    throw error;
  }
}

export default adoberemove;
