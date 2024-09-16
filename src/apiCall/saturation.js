import { axiosInstance } from ".";

export const SaturationChange = async (image) => {
  console.log("inside SaturationChange", image);
  try {
    const response = await axiosInstance.post("/change-saturation", image);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
