import { axios } from '@utils';
const apiName = '/api/SlitReceiving';

export const getReturnMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReturnMaterialDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-tab-wip`, { params: { ...params } });
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
