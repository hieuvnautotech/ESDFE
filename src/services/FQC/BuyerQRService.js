import { axios } from '@utils';
const apiName = '/api/BuyerQR';

export const getBuyerQR = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBuyerQR = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetBuyerQRPrint = async (params) => {
  try {
    return await axios.post(`${apiName}/get-print`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteBuyerQR = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
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
