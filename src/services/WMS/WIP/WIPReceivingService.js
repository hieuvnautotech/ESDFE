import { axios } from '@utils';
const apiName = '/api/wip-receiving';

// FROM SLIT CUT
export const getMaterialWIP = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scanWIPDetailLot = async (params) => {
  try {
    return await axios.post(`${apiName}/wip-scan-detail-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getWIPReceingDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getWIPDetailHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/wip-detail-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteScan = async (params) => {
  try {
    return await axios.put(`${apiName}/delete-scan`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getWIPSODetailLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getWIPSODetailLotBySlitSOId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-by-SlitSOId`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
// WMS
export const getMaterialWMS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-WMS`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetailWMS = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-wms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getDetailHistoryWMS = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-history-wms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getDetailLotWMS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-wms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const scanWIPDetailLotWMS = async (params) => {
  try {
    return await axios.post(`${apiName}/wip-scan-detail-lot-wms`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteScanWMS = async (params) => {
  try {
    return await axios.put(`${apiName}/delete-scan-wms`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getMSODetailLotByMSOId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-lot-by-MSOId`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
