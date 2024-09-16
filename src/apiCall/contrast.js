import { axiosInstance } from ".";

export const ContrastChange = async (image) => {
  console.log("inside ContrastChange", image);
  try {
    const response = await axiosInstance.post("/change-contrast", image);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
