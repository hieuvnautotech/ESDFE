import { axios } from '@utils';

const apiName = 'api/material-putaway';

export const get = async (params) => {
  try {
    return await axios.get(`${apiName}`, {
      params: { ...params },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanPutAway = async (params) => {
  try {
    return await axios.put(`${apiName}/scan-putaway`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const handleDelete = async (params) => {
  try {
    return await axios.put(`${apiName}/delete`, {
      ...params,
    });
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
