import { axios } from '@utils';
const apiName = '/api/FGStock';

export const getAll = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async () => {
  try {
    return await axios.get(`${apiName}/get-product`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getModel = async () => {
  try {
    return await axios.get(`${apiName}/get-model`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
