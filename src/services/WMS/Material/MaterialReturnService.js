import { axios } from '@utils';
const apiName = '/api/MaterialReturn';

export const getReturnMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
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

export const scanReturnMaterialDetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLocation = async (params) => {
  try {
    return await axios.get(`${apiName}/get-location`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
