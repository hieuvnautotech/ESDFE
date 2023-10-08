import { axios } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import { GetLocalStorage } from '@utils';
const apiName = '/api/FGShippingOrder';

export const getFGShippingOrderList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createFGShippingOrder = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyFGShippingOrder = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteFGShippingOrder = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBuyerList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-buyer-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBoxQRList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-box-qr`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBuyerQRList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-buyer-qr`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanBoxQR = async (params) => {
  try {
    return await axios.post(`${apiName}/scan-box-qr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteBoxQR = async (params) => {
  try {
    return await axios.put(`${apiName}/delete-box-qr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getAllBuyerQRList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all-buyer-qr`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadReport = async (params) => {
  try {
    const token = GetLocalStorage(ConfigConstants.TOKEN_ACCESS);
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `${ConfigConstants.API_URL}FGShippingOrder/download?FGSOId=${params.FGSOId}&createdName=${params.createdName}&createdDate=${params.DeliveryDate}&BuyerQR=${params.FGSOCode}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'FGShipping.xlsx';
        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      });
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
