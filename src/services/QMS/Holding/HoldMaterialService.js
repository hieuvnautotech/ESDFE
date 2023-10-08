import { axios } from '@utils';
const apiName = '/api/HoldMaterial';

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const hold = async (params) => {
  try {
    return await axios.post(`${apiName}/hold`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const unHold = async (params) => {
  try {
    return await axios.post(`${apiName}/unHold`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scrap = async (params) => {
  try {
    return await axios.post(`${apiName}/scrap`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getReCheck = async (QCIQCMasterId, LotCheckMasterId) => {
  try {
    return await axios.get(`${apiName}/get-check/${QCIQCMasterId}/${LotCheckMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const reCheck = async (params) => {
  try {
    return await axios.post(`${apiName}/reCheck`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
