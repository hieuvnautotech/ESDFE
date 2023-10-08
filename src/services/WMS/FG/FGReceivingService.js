import { axios } from '@utils';
const apiName = '/api/FGReceiving';

export const getBuyerQRShippingList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCSOList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteFGReceivingLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanBuyerQRShippingDetail = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-detail`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCSODetailAll = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-all-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
// end
export const scanBuyerQRStock = async (params, location) => {
  try {
    // console.log("params: ", params);
    return await axios.post(`${apiName}/receiving-stock/${location}`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProductList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-product-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFGReceivingModel = async (params) => {
  try {
    return await axios.get(`${apiName}/get-location`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const updateFGReceiving = async (params) => {
  try {
    console.log('service', params);
    return await axios.put(`${apiName}/update-fgreceiving`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCSODetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanReceivingBuyerQR = async (params) => {
  try {
    // console.log("params: ", params);
    return await axios.post(`${apiName}/scan-receiving-buyer`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFVISODetailAll = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-all-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteFVISODetailLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
