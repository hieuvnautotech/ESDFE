import { axios } from '@utils';
const apiName = '/api/Routing';

export const getRoutingList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createRouting = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyRouting = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteRouting = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
