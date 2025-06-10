import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // getSession from next-auth/react
    if (session?.user?.id) {
      config.headers.Authorization = `USER_ID ${session.user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
