import { axios } from '@utils';

const apiName = '/api/Location';

const getLocationList = async (params) => {
  try {
    return await axios.get(apiName, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getArea = async () => {
  try {
    return await axios.get(`${apiName}/get-area`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createLocation = async (params) => {
  try {
    return await axios.post(`${apiName}/create-location`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyLocation = async (params) => {
  try {
    return await axios.put(`${apiName}/modify-location`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteLocation = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-location`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createLocationByExcel = async (params) => {
  try {
    return await axios.post(`${apiName}/create-by-excel`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const PrintLocation = async (params) => {
  try {
    return await axios.post(`${apiName}/print-location`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export {
  getLocationList,
  getArea,
  createLocation,
  modifyLocation,
  deleteLocation,
  createLocationByExcel,
  PrintLocation,
};
