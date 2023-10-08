import { axios } from '@utils';
const apiName = '/api/MaterialStock';

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialLotList = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialListNG = async (params) => {
  try {
    return await axios.get(`${apiName}/get-tab-ng`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialLotListNG = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-lot-ng`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
