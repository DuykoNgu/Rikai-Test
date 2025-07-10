import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

const getAllCompanies = async (path) => {
  try {
    const { data } = await instance.get(path);
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

const getAllUsers = async (path) => {
  try {
    const { data } = await instance.get(path);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const getById = async (path, id) => {
  try {
    const { data } = await instance.get(`${path}/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

export default instance;

const createNewCompany = async (path, dataBody) => {
  try {
    const { data } = await instance.post(`${path}`, dataBody);
    return data;
  } catch (error) {
    console.error("Error creating company:", error);
  }
};

const createNewUsers = async (path, dataBody) => {
  try {
    const { data } = await instance.post(`${path}`, dataBody);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const removeUser = async (path, id) => {
  try {
    const { data } = await instance.delete(`${path}/${id}`);
    return data;
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

const removeCompany = async (path, id) => {
  try {
    const { data } = await instance.delete(`${path}/${id}`);
    return data;
  } catch (error) {
    console.error("Error removing company:", error);
  }
};

const updateUser = async (path, id, dataBody) => {
  try {
    const { data } = await instance.put(`${path}/${id}`, dataBody);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export {
  getAllCompanies,
  createNewCompany,
  getAllUsers,
  createNewUsers,
  removeUser,
  removeCompany,
  getById,
  updateUser,
};
