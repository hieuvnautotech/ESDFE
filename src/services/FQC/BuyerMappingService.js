import { axios } from '@utils';
const apiName = '/api/BuyerMapping';

export const getBuyerMapping = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const mappingBuyerQR = async (params) => {
  try {
    return await axios.post(`${apiName}/mapping`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBuyerQR = async (BuyerQR) => {
  try {
    return await axios.get(`${apiName}/getForChageQR/${BuyerQR}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const changeBuyerQR = async (params) => {
  try {
    return await axios.post(`${apiName}/changeQR`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//Check OQC
export const getCheckOQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-check-oqc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkOQC = async (params) => {
  try {
    return await axios.post(`${apiName}/check-oqc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
