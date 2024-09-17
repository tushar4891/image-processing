import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://image-processing-4.onrender.com",
  //   headers: {
  //     authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
});
