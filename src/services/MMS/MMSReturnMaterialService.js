import { axios } from '@utils';
const apiName = '/api/MMSReturnMaterial';

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const confirm = async (params) => {
  try {
    return await axios.post(`${apiName}/mms-material-confirm`, params);
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

export const editLength = async (params) => {
  try {
    return await axios.put(`${apiName}/edit-length`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
