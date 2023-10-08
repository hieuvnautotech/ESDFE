import { axios } from '@utils';
const apiName = '/api/HoldFinishGood';

export const getAllList = async (params) => {
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

export const getLog = async (params) => {
  try {
    return await axios.get(`${apiName}/get-log`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPrint = async (params) => {
  try {
    return await axios.post(`${apiName}/get-print`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
