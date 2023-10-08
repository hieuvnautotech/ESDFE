import { axios } from '@utils';
const apiName = '/api/QCIQC';

export const getIQCMasterList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getMaterialType = async (params) => {
  try {
    return await axios.get(`${apiName}/get-material-type`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const create = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const copy = async (params) => {
  try {
    return await axios.post(`${apiName}/copy`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteIQCMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const confirmIQCMaster = async (params) => {
  try {
    return await axios.delete(`${apiName}/confirm`, { data: params });
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
export const getItemUnit = async () => {
  try {
    return await axios.get(`${apiName}/get-Item-Unit-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//DETAIL RAW MATERIAL
export const getIQCDetailRM = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-raw-material`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createDetailRM = async (params) => {
  try {
    return await axios.post(`${apiName}/create-DetailRM`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteIQCRM = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Detail-RM`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const clearIQCRM = async (QCIQCMasterId) => {
  try {
    return await axios.delete(`${apiName}/clear-detail-RM/${QCIQCMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//DETAIL MATERIAL
export const getIQCDetailM = async (params) => {
  try {
    return await axios.get(`${apiName}/get-detail-material`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createDetailM = async (params) => {
  try {
    return await axios.post(`${apiName}/create-DetailMaterial`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteIQCM = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Detail-M`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const clearIQCM = async (QCIQCMasterId) => {
  try {
    return await axios.delete(`${apiName}/clear-detail-M/${QCIQCMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
