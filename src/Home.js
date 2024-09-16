import React, { useState } from "react";
import { FaImage } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import "./Home.css";
import { LoadImage } from "./apiCall/imageUpload";
import { BrightnessChange } from "./apiCall/brightness";
import { ContrastChange } from "./apiCall/contrast";
import { SaturationChange } from "./apiCall/saturation";
import { RotateChange } from "./apiCall/rotate";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [newImage, setNewImage] = useState(null);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Here you can also generate a low-quality preview of the image
      setPreviewImage(imageUrl); // Replace with logic for preview

      try {
        const response = await LoadImage(file);
        if (response.success) {
          console.log("Image uploaded ! ");
          setNewImage(response.image_path);
        } else {
          console.log("Image not uploaded !");
        }
      } catch (err) {}
    }
  };

  const handleBrightness = async (e) => {
    setBrightness(e.target.value);
    const image = {
      imagePath: newImage,
      brightness: parseFloat(e.target.value),
    };
    try {
      const response = await BrightnessChange(image);
      if (response.preview_url) {
        console.log("Preview ready:", response.preview_url);

        // Cache-busting: Add a unique query string to the preview URL to prevent browser caching
        const previewUrlWithCacheBusting = `${
          response.preview_url
        }?t=${new Date().getTime()}`;

        console.log("Cache-busted preview URL:", previewUrlWithCacheBusting); // Log this URL
        setPreviewImage(previewUrlWithCacheBusting); // Set the cache-busted URL

        // setPreviewImage(response.preview_url); // ****** original Set the preview image URL in the frontend
      } else {
        console.log("Brightness could not be changed !");
      }
    } catch (err) {
      console.log("Error adjusting brightness", err);
    }
  };

  // New handleContrast function
  const handleContrast = async (e) => {
    setContrast(e.target.value);
    const image = {
      imagePath: newImage,
      contrast: parseFloat(e.target.value),
    };
    try {
      const response = await ContrastChange(image);
      if (response.preview_url) {
        const previewUrlWithCacheBusting = `${
          response.preview_url
        }?t=${new Date().getTime()}`;
        setPreviewImage(previewUrlWithCacheBusting);
      } else {
        console.log("Contrast could not be changed!");
      }
    } catch (err) {
      console.log("Error adjusting contrast", err);
    }
  };

  const handleSaturation = async (e) => {
    setSaturation(e.target.value);
    const image = {
      imagePath: newImage,
      saturation: parseFloat(e.target.value),
    };
    try {
      const response = await SaturationChange(image);
      if (response.preview_url) {
        const previewUrlWithCacheBusting = `${
          response.preview_url
        }?t=${new Date().getTime()}`;
        setPreviewImage(previewUrlWithCacheBusting);
      } else {
        console.log("Saturation could not be changed!");
      }
    } catch (err) {
      console.log("Error adjusting saturation", err);
    }
  };

  const handleRotation = async (e) => {
    setRotate(e.target.value);
    const image = {
      imagePath: newImage,
      rotate: parseFloat(e.target.value),
    };
    try {
      const response = await RotateChange(image);
      if (response.preview_url) {
        const previewUrlWithCacheBusting = `${
          response.preview_url
        }?t=${new Date().getTime()}`;
        setPreviewImage(previewUrlWithCacheBusting);
      } else {
        console.log("Rotation could not be changed!");
      }
    } catch (err) {
      console.log("Error adjusting rotation", err);
    }
  };

  const handleClearSelection = () => {
    setSelectedImage(null);
    setPreviewImage(null);
  };

  return (
    <div
      className="pt-3"
      style={{
        backgroundColor: "#1a202c",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div style={{ marginLeft: "35px", textAlign: "left", maxWidth: "900px" }}>
        <h1 style={{ color: "#ffffff", fontSize: "50px" }}>
          Change Images Online
        </h1>
        <p className="fs-5">
          Looking to edit brightness of your images? Check out this free online
          tool that lets you adjust contrast with ease! No download required and
          unlimited usage.
        </p>
      </div>

      {/* Image Upload and Controls */}
      <div className="d-flex justify-content-center gap-3">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
        <button
          onClick={() => document.getElementById("image-upload").click()}
          style={{
            height: "40px",
            width: "170px",
            borderRadius: "4px",
            backgroundColor: "#ecc94b",
            border: "none",
          }}
        >
          <FaImage style={{ marginRight: "7px" }} />
          Select Image
        </button>
        <button
          onClick={handleClearSelection}
          style={{
            height: "40px",
            width: "170px",
            borderRadius: "4px",
            backgroundColor: "#f56565",
            border: "none",
          }}
        >
          <MdClear style={{ marginRight: "3px" }} /> Clear Selection
        </button>
      </div>

      {/* Image Preview Section */}
      <div>
        <div
          className="dotted-rectangle mt-4"
          style={{
            border: "2px dashed #cccccc",
            borderRadius: "4px",
            height: "300px",
            width: "80%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {selectedImage ? (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxHeight: "90%",
                  maxWidth: "40%",
                  borderRadius: "4px",
                }}
              />
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxHeight: "90%",
                  maxWidth: "40%",
                  marginLeft: "10px",
                  borderRadius: "4px",
                }}
              />
            </>
          ) : (
            <p style={{ color: "#ffffff" }}>Drop your image files here</p>
          )}
        </div>
      </div>

      <div>
        <div className="d-flex">
          {/* Range Filters Section */}
          <div
            style={{
              marginTop: "20px",
              maxWidth: "200px",
              margin: "0 auto",
              backgroundColor: "#1a202c",
              padding: "10px",
              color: "#ffffff",
            }}
          >
            <label
              for="customRange2"
              class="form-label"
              style={{ color: "white" }}
            >
              Brightness
            </label>

            <input
              type="range"
              className="form-range custom-slider"
              id="brightnessRange"
              min="1"
              max="2"
              value={brightness}
              step="0.1"
              onChange={handleBrightness}
              style={{ width: "100%" }} // Limit width to container
            />
            <span>{brightness}</span>
          </div>

          <div
            style={{
              marginTop: "20px",
              maxWidth: "200px",
              margin: "0 auto",
              backgroundColor: "#1a202c",
              padding: "10px",
              color: "#ffffff",
            }}
          >
            <label
              for="customRange"
              class="form-label"
              style={{ color: "white" }}
            >
              Contrast
            </label>

            <input
              type="range"
              className="form-range custom-slider"
              id="contrastRange"
              min="0"
              max="2"
              value={contrast}
              step="0.1"
              onChange={handleContrast}
              style={{ width: "100%" }} // Limit width to container
            />
            <span>{contrast}</span>
          </div>
        </div>
        <div className="d-flex">
          <div
            style={{
              marginTop: "20px",
              maxWidth: "200px",
              margin: "0 auto",
              backgroundColor: "#1a202c",
              padding: "10px",
              color: "#ffffff",
            }}
          >
            <label
              for="customRange2"
              class="form-label"
              style={{ color: "white" }}
            >
              Saturation
            </label>

            <input
              type="range"
              className="form-range custom-slider"
              id="saturationRange"
              min="0"
              max="3"
              value={saturation}
              step="0.1"
              onChange={handleSaturation}
              style={{ width: "100%" }} // Limit width to container
            />
            <span>{saturation}</span>
          </div>

          <div
            style={{
              marginTop: "20px",
              maxWidth: "200px",
              margin: "0 auto",
              backgroundColor: "#1a202c",
              padding: "10px",
              color: "#ffffff",
            }}
          >
            <label
              for="customRange"
              class="form-label"
              style={{ color: "white" }}
            >
              Rotate
            </label>

            <input
              type="range"
              className="form-range custom-slider"
              id="rotateRange"
              min="-360"
              max="360"
              value={rotate}
              step="45"
              onChange={handleRotation}
              style={{ width: "100%" }} // Limit width to container
            />
            <span>{rotate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
