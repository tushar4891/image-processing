import { axiosInstance } from ".";

export const RotateChange = async (image) => {
  console.log("inside RotateChange", image);
  try {
    const response = await axiosInstance.post("/change-rotate", image);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
