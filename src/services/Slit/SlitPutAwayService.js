import { axios } from '@utils';

const apiName = 'api/slit-putaway';

export const get = async (params) => {
  try {
    return await axios.get(`${apiName}`, {
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

export const scanPutAway = async (params) => {
  try {
    return await axios.put(`${apiName}/scan-putaway-material-raw`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const handleDeleteRaw = async (params) => {
  try {
    return await axios.put(`${apiName}/delete-material-raw`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
