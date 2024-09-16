const express = require("express");
const sharp = require("sharp");
const path = require("path");
const router = express.Router();

// Image compression route
router.post("/compress", express.json(), (req, res) => {
  const { imagePath, quality } = req.body;

  if (!imagePath || !quality) {
    return res.status(400).json({ success: 0, message: "Invalid parameters" });
  }

  // Output file path for the compressed image
  const outputFilePath = `./upload/images/compress_${path.basename(imagePath)}`;

  // Compress image using sharp
  sharp(imagePath)
    .jpeg({ quality })
    .toFile(outputFilePath, (err, info) => {
      if (err) {
        console.error("Error processing image:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error processing image" });
      }

      res.json({
        success: true,
        message: "Image compressed",
        modified_url: `http://localhost:4000/profile/compress_${path.basename(
          imagePath
        )}`,
      });
    });
});

module.exports = router;
