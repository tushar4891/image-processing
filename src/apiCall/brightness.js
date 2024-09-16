import { axiosInstance } from ".";

export const BrightnessChange = async (image) => {
  console.log("inside BrightnessChange", image);
  try {
    const response = await axiosInstance.post("/change-brightness", image);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
