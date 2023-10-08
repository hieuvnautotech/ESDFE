import { axios } from '@utils';
const apiName = '/api/FQCStock';

export const getAll = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, { params: { ...params } });
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

export const getAllOQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-oqc-all`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetailOQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-oqc-detail`, { params: { ...params } });
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

export const getModel = async () => {
  try {
    return await axios.get(`${apiName}/get-model`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getStatus = async (tab) => {
  try {
    return await axios.get(`${apiName}/get-status`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProductType = async () => {
  try {
    return await axios.get(`${apiName}/get-product-type`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
