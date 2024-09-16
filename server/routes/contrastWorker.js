// contrastWorker.js
const { parentPort, workerData } = require("worker_threads");
const sharp = require("sharp");
const path = require("path");

const { imagePath, contrast } = workerData;

// Append a timestamp to ensure a unique filename for each preview
const timestamp = Date.now();
const contrast_level = `contrast_${contrast}`;
const lowQualityOutputPath = `./upload/images/preview_${timestamp}_${contrast_level}_${path.basename(
  imagePath
)}`;

// Create a low-quality preview image for real-time preview
sharp(imagePath)
  .resize({ width: 200 }) // Resize for a smaller image (low quality)
  .jpeg({ quality: 40 }) // Adjust quality for faster processing
  .linear(contrast, -(128 * (contrast - 1))) // Apply brightness change
  .toFile(lowQualityOutputPath, (err, info) => {
    if (err) {
      parentPort.postMessage({
        success: false,
        message: "Error processing preview image",
      });
    } else {
      // Send the low-quality preview to the frontend
      parentPort.postMessage({
        success: true,
        message: "Low-quality preview ready",
        preview_url: `http://localhost:4000/profile/${path.basename(
          lowQualityOutputPath
        )}`,
      });
    }
  });
