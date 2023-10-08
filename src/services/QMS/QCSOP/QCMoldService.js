import { axios } from '@utils';
const apiName = '/api/QCMold';

export const getMoldMasterList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMoldMaster = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyMoldMaster = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMoldMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const confirmMoldMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/confirm`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const copyMoldMaster = async (params) => {
  try {
    return await axios.post(`${apiName}/copy`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMoldMasterProduct = async (QCMoldMasterId) => {
  try {
    return await axios.get(`${apiName}/get-product/${QCMoldMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMoldDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMoldDetail = async (params) => {
  try {
    return await axios.post(`${apiName}/create-detail`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMoldDetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const clearMoldDetail = async (QCMoldMasterId) => {
  try {
    return await axios.delete(`${apiName}/clear-detail/${QCMoldMasterId}`);
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
export const getFrequency = async (params) => {
  try {
    return await axios.get(`${apiName}/get-qc-frequency`, {
      params: {
        ...params,
      },
    });
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

export const getTypeQC = async () => {
  try {
    return await axios.get(`${apiName}/get-TypeQC-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
