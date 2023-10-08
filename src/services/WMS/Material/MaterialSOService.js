import { axios } from '@utils';
const apiName = '/api/MaterialShippingOrder';

export const getMaterialSOList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMaterialSO = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyMaterialSO = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMaterialSO = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialSODetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialSODetailHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMaterialSODetail = async (MSOId, params) => {
  try {
    return await axios.post(`${apiName}/create-detail/${MSOId}`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMaterialSODetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialSODetailLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialSODetailLotByMSOId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-by-MSOId`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanMaterialSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const receivingMaterialSODetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-receiving-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMaterialSODetailLot = async (params) => {
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

export const getProductMapping = async (MSOId) => {
  try {
    return await axios.get(`${apiName}/get-product/${MSOId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
