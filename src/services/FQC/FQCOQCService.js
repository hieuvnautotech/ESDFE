import { axios } from '@utils';
const api = '/api/fqc-oqc';

export const getAll = async (params) => {
  try {
    return await axios.get(api, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetail = async (params) => {
  try {
    return await axios.get(`${api}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanReceiving = async (params) => {
  try {
    return await axios.post(`${api}/scan-oqc`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//Check QC
export const getCheckQC = async (params) => {
  try {
    return await axios.get(`${api}/get-check-qc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkQC = async (params) => {
  try {
    return await axios.post(`${api}/check-qc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getStaffQC = async () => {
  try {
    return await axios.get(`${api}/get-staff-check`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteOQC = async (params) => {
  try {
    return await axios.delete(`${api}/delete-oqc`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
