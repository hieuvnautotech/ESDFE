import { axios } from '@utils';
const apiName = '/api/HoldSemiLot';

export const getAllSemiFQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all-semi-fqc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getAllSemiMMS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all-semi-mms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

// FQC
export const holdFQC = async (params) => {
  try {
    return await axios.post(`${apiName}/hold-fqc`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const unHoldFQC = async (params) => {
  try {
    return await axios.post(`${apiName}/unHold-fqc`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scrapFQC = async (params) => {
  try {
    return await axios.post(`${apiName}/scrap-fqc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//MMS
export const holdMMS = async (params) => {
  try {
    return await axios.post(`${apiName}/hold-mms`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const unHoldMMS = async (params) => {
  try {
    return await axios.post(`${apiName}/unHold-mms`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const scrapMMS = async (params) => {
  try {
    return await axios.post(`${apiName}/scrap-mms`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLogFQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-log-fqc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLogMMS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-log-mms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCDetailSL = async (QCPQCMasterId, WOSemiLotMMSId) => {
  try {
    return await axios.get(`${apiName}/get-list-pqc-sl/${QCPQCMasterId}/${WOSemiLotMMSId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCDetailSLValue = async (WOSemiLotMMSId) => {
  try {
    return await axios.get(`${apiName}/get-value-pqc-sl/${WOSemiLotMMSId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkPQCSL = async (params) => {
  try {
    return await axios.post(`${apiName}/check-pqc-sl`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPrintFQC = async (params) => {
  try {
    return await axios.post(`${apiName}/get-print`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
