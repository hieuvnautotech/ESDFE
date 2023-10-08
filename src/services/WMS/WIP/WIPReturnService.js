import { axios } from '@utils';
const apiName = '/api/WIPReturn';

export const getReturnMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createReturnMaterial = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyReturnMaterial = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteReturnMaterial = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReturnMaterialDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReturnMaterialDetailHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createReturnMaterialDetail = async (RMId, params) => {
  try {
    return await axios.post(`${apiName}/create-detail/${RMId}`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteReturnMaterialDetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReturnMaterialDetailLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReturnMaterialDetailLotByRMId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-by-RMId`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanReturnMaterialDetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanReturnMaterialDetailLotWIP = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot-wip`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const receivingReturnMaterialDetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-receiving-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteReturnMaterialDetailLot = async (params) => {
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

export const getMaterialWIPList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-material-wip`, { params: { ...params } });
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

export const getViewLot = async (params) => {
  try {
    return await axios.get(`${apiName}/view-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
