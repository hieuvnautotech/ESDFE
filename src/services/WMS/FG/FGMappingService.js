import { axios } from '@utils';
const apiName = '/api/FGMapping';

export const getAll = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanBuyerQR = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-buyerqr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBuyerQR = async (params) => {
  try {
    return await axios.post(`${apiName}/create-buyerqr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const unMapping = async (params) => {
  try {
    return await axios.put(`${apiName}/unMapping`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPrint = async (params) => {
  try {
    return await axios.post(`${apiName}/get-print`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async () => {
  try {
    return await axios.get(`${apiName}/get-product`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
