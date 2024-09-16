let storedImage = null;
let imageName = null;

const setStoredImageName = (value) => {
  console.log("Setting storedImage to:", value);
  storedImage = value;
};

const getStoredImageName = () => {
  console.log("Getting storedImage:", storedImage);
  return storedImage;
};

const setLastProcessedImageName = (value) => {
  imageName = value;
};
const getLastProcessedImageName = () => imageName;

module.exports = {
  setStoredImageName,
  getStoredImageName,
  setLastProcessedImageName,
  getLastProcessedImageName,
};
