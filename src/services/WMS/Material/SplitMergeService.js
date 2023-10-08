import { axios } from '@utils';

const apiName = 'api/split-merge';

export const getMaterialLabel = async (Id) => {
  try {
    return await axios.get(`${apiName}/get-material`, {
      params: { MaterialLotCode: Id },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const splitLot = async (params) => {
  try {
    return await axios.post(`${apiName}/split-lot`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetListPrintQR = async (params) => {
  try {
    return await axios.post(`${apiName}/get-list-print-qr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSplitList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-list-split`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSplitDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-split-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteDetailSplit = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-split-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const mergeLot = async (params) => {
  try {
    return await axios.post(`${apiName}/merge-lot`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
