// rotationWorker.js
const { parentPort, workerData } = require("worker_threads");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { imagePath, rotate, outputPath } = workerData;

// Resolve the input and output paths to absolute paths
const resolvedImagePath = path.resolve(imagePath); // Absolute input path
const resolvedOutputPath = path.resolve(outputPath); // Absolute output path

// Check if the image file exists before processing
fs.access(resolvedImagePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("File not found or inaccessible:", resolvedImagePath);
    parentPort.postMessage({
      success: false,
      message: "Image file not found",
    });
  } else {
    // Create a low-quality preview image for real-time preview
    console.log("00000 -- ", resolvedImagePath);
    sharp(resolvedImagePath)
      .resize({ width: 200 }) // Resize for a smaller image (low quality)
      .jpeg({ quality: 40 }) // Adjust quality for faster processing
      .rotate(rotate) // Apply rotation change
      .toFile(resolvedOutputPath, (err, info) => {
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
              resolvedOutputPath
            )}`,
          });
        }
      });
  }
});
