import { axiosInstance } from ".";

export const LoadImage = async (selectedImageFile) => {
  // Prepare the image file in FormData
  const formData = new FormData();
  formData.append("profile", selectedImageFile);
  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
