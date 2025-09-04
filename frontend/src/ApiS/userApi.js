import apiInstance from "../Network/apiInterceptor";

export const getAllUsers = async (perPage = -1, page = 1) => {
  try {
    return await apiInstance.get(`/user/topics`, { params: { perPage, page } });
  } catch (err) {
    console.error("Error fetching topics:", err.response || err.message);
    throw err;
  }
};

export const getAllSSR = async (limit = -1, page = 1, token) => {
  try {
    return await axios.get(`${API_URL}/user/topics`, {
      params: { limit, page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err.response || err.message);
    throw err.response;
  }
};

export const toggleStatus = async (userId) => {
  try {
    return await apiInstance.patch(`/user/topic/${userId}`);
  } catch (err) {
    console.error("Error changing status:", err.response || err.message);
    throw err;
  }
};

// Login & Register - Direct API Calls (No Interceptor)
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData) => {
  try {
    return await axios.post(`${API_URL}/user/register`, userData);
  } catch (err) {
    throw err.response;
  }
};

export const loginUser = async (userData) => {
  try {
    return await axios.post(`${API_URL}/user/login`, userData);
  } catch (err) {
    throw err.response;
  }
};
