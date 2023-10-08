import { axios } from '@utils';
const apiName = '/api/WIPStock';

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

export const getProductListStock = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all-product`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSemiLotList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-semi-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetListPrintQR = async (params) => {
  try {
    return await axios.post(`${apiName}/get-list-print-qr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
