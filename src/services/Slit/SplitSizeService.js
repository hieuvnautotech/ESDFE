import { axios } from '@utils';

const apiName = 'api/SplitSize';

export const get = async (params) => {
  try {
    return await axios.get(`${apiName}`, {
      params: { ...params },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/Detail`, {
      params: { ...params },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLocation = async (params) => {
  try {
    return await axios.get(`${apiName}/get-location-tab-raw`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanCode = async (MaterialLotCode) => {
  try {
    return await axios.get(`${apiName}/getLotCode/${MaterialLotCode}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const split = async (MaterialLotId, params) => {
  try {
    return await axios.post(`${apiName}/Split/${MaterialLotId}`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const reset = async (params) => {
  try {
    return await axios.post(`${apiName}/reset`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
