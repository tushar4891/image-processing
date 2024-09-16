const express = require("express");
const sharp = require("sharp");
const path = require("path");
const router = express.Router();
const { Worker } = require("worker_threads");

router.post("/change-contrast", express.json(), (req, res) => {
  console.log("Inside /change-contrast", req.body);

  const { imagePath, contrast } = req.body;

  if (!imagePath || !contrast) {
    return res.status(400).json({ success: 0, message: "Invalid parameters" });
  }

  // Step 1: Process the low-quality preview image in a worker thread
  const worker = new Worker("./routes/contrastWorker.js", {
    workerData: { imagePath, contrast },
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
  const fullQualityOutputPath = `./upload/images/contrast_${path.basename(
    imagePath
  )}`;

  sharp(imagePath)
    .linear(contrast, -(128 * (contrast - 1)))
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
  };
});

module.exports = router;
