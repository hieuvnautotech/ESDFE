import { axios } from '@utils';
const apiName = '/api/FQCShipping';

export const getFQCSOList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createFQCSO = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyFQCSO = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteFQCSO = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCSODetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCSODetailAll = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-all-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanFQCSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const receivingFQCSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-receiving-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteFQCSODetailLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProductList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-product-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
