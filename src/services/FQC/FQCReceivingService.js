import { axios } from '@utils';
const api = '/api/fqc-receiving';
export const getAll = async (params) => {
  try {
    return await axios.get(api, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const scanReceiving = async (params) => {
  try {
    return await axios.post(`${api}/scan-fqc-receiving`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetailHistory = async (params) => {
  try {
    return await axios.get(`${api}/history-receiving`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
