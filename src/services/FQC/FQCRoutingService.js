import { axios } from '@utils';
const apiName = '/api/fqc-routing';
export const getProductList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getRoutingDetailList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProcess = async () => {
  try {
    return await axios.get(`${apiName}/get-process`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createRoutingDetail = async (params) => {
  try {
    return await axios.post(`${apiName}/create-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyRoutingDetail = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteRoutingDetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
