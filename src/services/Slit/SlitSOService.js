import { axios } from '@utils';
const apiName = '/api/SlitShippingOrder';

export const getSlitSOList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createSlitSO = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifySlitSO = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSlitSO = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitSODetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitSODetailHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createSlitSODetail = async (SlitSOId, params) => {
  try {
    return await axios.post(`${apiName}/create-detail/${SlitSOId}`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSlitSODetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitSODetailLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitSODetailLotBySlitSOId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-by-SlitSOId`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanSlitSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const receivingSlitSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-receiving-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSlitSODetailLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-material`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLocationList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-location-list`, { params: { ...params } });
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
