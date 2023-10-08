import { axios } from '@utils';
const apiName = '/api/HoldLog';

export const GetLogRawMaterial = async (params) => {
  try {
    return await axios.get(`${apiName}/get-raw-material`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetLogMaterial = async (params) => {
  try {
    return await axios.get(`${apiName}/get-material`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetMMSLog = async (params) => {
  try {
    return await axios.get(`${apiName}/get-mms-semi`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetFQCLog = async (params) => {
  try {
    return await axios.get(`${apiName}/get-fqc-semi`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetFGLog = async (params) => {
  try {
    return await axios.get(`${apiName}/get-fg`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getStatus = async (params) => {
  try {
    return await axios.get(`${apiName}/get-hold-status`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
