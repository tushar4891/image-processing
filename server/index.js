const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
  })
);
// storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload images only"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

const brightnessRoute = require("./routes/brightness");
const contrastRoute = require("./routes/contrast");
const rotateRoute = require("./routes/rotate");
const saturationRoute = require("./routes/saturation");

app.use("/profile", express.static("upload/images"));
// Use the separate routes for different operations
app.use("/", brightnessRoute);
app.use("/", saturationRoute);
app.use("/", contrastRoute);
app.use("/", rotateRoute);

app.post("/upload", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const imagePath = req.file.path; // Store the image path to use later

  // Respond with uploaded image path so frontend can use this in further operations
  res.json({
    success: true,
    profile_url: `http://localhost:4000/profile/${req.file.filename}`,
    image_path: imagePath, // Send the image path to be used by other routes
  });
});

function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  } else if (err) {
    // Handle custom errors like invalid file type
    res.status(400).json({
      success: 0,
      message: err.message,
    });
  } else {
    next();
  }
}

app.use(errHandler);
app.listen(4000, () => {
  console.log("server up and running at 4000 ");
});
