const express = require("express");
const sharp = require("sharp");
const path = require("path");
const router = express.Router();
const { Worker } = require("worker_threads");

let processedImagePath = null; // Store path of processed image
let lastProcessedImageName = null; // Store the last processed image name

router.post("/change-rotate", express.json(), (req, res) => {
  const { imagePath, rotate } = req.body;

  if (!imagePath || !rotate) {
    return res.status(400).json({ success: 0, message: "Invalid parameters" });
  }

  // Step 1: Extract the filename from the incoming image path
  const currentImageName = path.basename(imagePath);

  // Step 2: Compare with the last processed image name
  if (lastProcessedImageName === currentImageName && processedImagePath) {
    // Use the previously processed image for further adjustments
    console.log("Using previously processed image:", processedImagePath);
  } else {
    // New image has been uploaded, so reset the processed image path
    lastProcessedImageName = currentImageName;
    processedImagePath = imagePath; // Reset the processed image path for the new image
  }

  // If no intermediate image is available, use the original image
  processedImagePath = processedImagePath || imagePath;

  // Resolve the paths to ensure absolute paths
  let resolvedImagePath = path.resolve(processedImagePath); // Convert to absolute path
  const workerOutputPath = path.resolve(
    `./upload/images/preview_${Date.now()}rotate${rotate}_${currentImageName}`
  ); // Absolute path for worker output

  const worker = new Worker("./routes/rotateWorker.js", {
    workerData: {
      imagePath: resolvedImagePath, // Pass the resolved absolute input path
      rotate,
      outputPath: workerOutputPath, // Pass the resolved absolute output path
    },
  });

  let workerFinished = false;
  let mainThreadFinished = false;
  let previewResult = null;
  let fullQualityResult = null;

  // Step 2: Handle worker thread's message (low-quality preview)
  worker.on("message", (message) => {
    workerFinished = true;
    previewResult = message;

    if (workerFinished && mainThreadFinished) {
      sendFinalResponse();
    }
  });

  // Handle worker thread errors
  worker.on("error", (error) => {
    workerFinished = true;
    previewResult = { success: false, message: "Worker thread error" };

    if (workerFinished && mainThreadFinished) {
      sendFinalResponse();
    }
  });

  // Step 3: Process the full-quality image in the main thread
  const fullQualityOutputPath = path.resolve(
    `./upload/images/processed_${path.basename(imagePath)}`
  );

  sharp(resolvedImagePath)
    .rotate(rotate)
    .toFile(fullQualityOutputPath, (err, info) => {
      mainThreadFinished = true;

      if (err) {
        fullQualityResult = {
          success: false,
          message: "Error processing full-quality image",
        };
      } else {
        fullQualityResult = {
          success: true,
          message: "Full-quality image processed",
          image_url: fullQualityOutputPath, // Path to the full-quality image
        };
      }

      if (workerFinished && mainThreadFinished) {
        sendFinalResponse();
      }
    });

  // Step 4: Send a final response only when both worker and main thread are done
  const sendFinalResponse = () => {
    if (previewResult.success && fullQualityResult.success) {
      console.log("preview_url 0000", previewResult.preview_url);
      res.json({
        success: true,
        message: "Both images processed successfully",
        preview_url: previewResult.preview_url, // URL to the low-quality preview
        full_image_url: fullQualityResult.image_url, // URL to the full-quality image
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error processing one or both images",
        preview_result: previewResult,
        full_quality_result: fullQualityResult,
      });
    }
    // Reset the state for the next request
    processedImagePath = null;
    lastProcessedImageName = null;
  };
});

module.exports = router;
