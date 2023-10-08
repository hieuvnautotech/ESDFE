import { axios } from '@utils';
const apiName = '/api/QCPQC';

export const getPQCMasterList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createPQCMaster = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyPQCMaster = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deletePQCMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const confirmPQCMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/confirm`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const copyPQCMaster = async (params) => {
  try {
    return await axios.post(`${apiName}/copy`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCMasterProduct = async (QCPQCMasterId) => {
  try {
    return await axios.get(`${apiName}/get-product/${QCPQCMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCMasterProcess = async (QCPQCMasterId) => {
  try {
    return await axios.get(`${apiName}/get-process/${QCPQCMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCAS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-as`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createPQCAS = async (params) => {
  try {
    return await axios.post(`${apiName}/create-detail-as`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deletePQCAS = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-as`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCSL = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-sl`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createPQCSL = async (params) => {
  try {
    return await axios.post(`${apiName}/create-detail-sl`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deletePQCSL = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail-sl`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const clearPQCSL = async (QCPQCMasterId) => {
  try {
    return await axios.delete(`${apiName}/clear-detail-sl/${QCPQCMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async () => {
  try {
    return await axios.get(`${apiName}/get-product-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getType = async (params) => {
  try {
    return await axios.get(`${apiName}/get-qc-type`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getItem = async (params) => {
  try {
    return await axios.get(`${apiName}/get-qc-item/${params}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getStandard = async (QCTypeId, QCItemId) => {
  try {
    return await axios.get(`${apiName}/get-qc-standard/${QCTypeId}/${QCItemId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getTool = async (QCTypeId, QCItemId, QCStandardId) => {
  try {
    return await axios.get(`${apiName}/get-qc-tool`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLocation = async () => {
  try {
    return await axios.get(`${apiName}/get-Location-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProcess = async () => {
  try {
    return await axios.get(`${apiName}/get-Process-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFrequency = async () => {
  try {
    return await axios.get(`${apiName}/get-frequency-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
