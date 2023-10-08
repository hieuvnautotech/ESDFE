import { axios } from '@utils';
const apiName = '/api/SlitOrder';

export const getAll = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
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
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteSlitOrder = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Slit Order Detail
export const getSlitOrderDetailList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-slitOrder-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createSlitOrderDetail = async (params) => {
  try {
    return await axios.post(`${apiName}/create-slitOrder-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const modifySlitOrderDetail = async (params) => {
  try {
    return await axios.put(`${apiName}/update-slitOrder-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSlitOrderDetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-slitOrder-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//OPTION SELECT
export const getListModel = async () => {
  try {
    return await axios.get(`${apiName}/get-model-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterial = async () => {
  try {
    return await axios.get(`${apiName}/get-material-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBlade = async () => {
  try {
    return await axios.get(`${apiName}/get-blade-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getRawLotMaterial = async (SlitOrderId) => {
  try {
    return await axios.get(`${apiName}/get-raw-material-list/${SlitOrderId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMachine = async () => {
  try {
    return await axios.get(`${apiName}/get-machine-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getWorkers = async () => {
  try {
    return await axios.get(`${apiName}/get-worker-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getStaffCheckSlit = async () => {
  try {
    return await axios.get(`${apiName}/get-staff-check-slit`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getListProductSlit = async (params) => {
  try {
    return await axios.get(`${apiName}/get-product-slit`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//Slit turn
export const getSlitTurnRaw = async (params) => {
  try {
    return await axios.get(`${apiName}/get-slit-turn-raw`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitTurnRawDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-slit-turn-raw-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitTurn = async (params) => {
  try {
    return await axios.get(`${apiName}/get-slit-turn`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getSlitTurnDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-slit-turn-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const slit = async (params) => {
  try {
    return await axios.post(`${apiName}/slit`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSlitTurn = async (params) => {
  try {
    return await axios.post(`${apiName}/delete-slit-turn`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const finishSlitTurn = async (params) => {
  try {
    return await axios.post(`${apiName}/finish-slit-turn`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const resetSlitTurn = async (params) => {
  try {
    return await axios.post(`${apiName}/reset-slit-turn`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const editSlitTurn = async (params) => {
  try {
    return await axios.post(`${apiName}/edit-slit-turn`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkIQC = async (params) => {
  try {
    return await axios.post(`${apiName}/check`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getCheckIQC = async (QCIQCMasterId, LotCheckMasterId) => {
  try {
    return await axios.get(`${apiName}/get-check/${QCIQCMasterId}/${LotCheckMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getTurn = async (SlitOrderId, MaterialLotId) => {
  try {
    return await axios.get(`${apiName}/get-turn/${SlitOrderId}/${MaterialLotId}`);
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

export const GetListPrintQR = async (params) => {
  try {
    return await axios.post(`${apiName}/get-list-print-qr`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
