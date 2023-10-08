import { axios } from '@utils';
const apiName = '/api/MaterialReceiving';

export const getMaterialReceivingList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getLotNoList = async (params) => {
  try {
    return await axios.get(`${apiName}/lotno`, { params: { ...params } });
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
export const deleteRecevingMaterial = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const addLot = async (params) => {
  try {
    return await axios.post(`${apiName}/add-lot`, {
      ...params,
    });
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
export const getIQCForm = async (params) => {
  try {
    return await axios.get(`${apiName}/get-iqc-form/${params}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getMaterialLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-materialReceivingLot-all`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialLotPrint = async (params) => {
  try {
    return await axios.get(`${apiName}/get-materialReceivingLot-all-Print`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Check IQC MATERIAL
export const getCheckIQC = async (QCIQCMasterId, LotCheckMasterId) => {
  try {
    return await axios.get(`${apiName}/get-check/${QCIQCMasterId}/${LotCheckMasterId}`);
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

export const checkIQCSUS = async (params) => {
  try {
    return await axios.post(`${apiName}/checkSUS`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//check IQC Raw Material
export const getStaffQC = async () => {
  try {
    return await axios.get(`${apiName}/get-staff-check`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getCheckIQCRaw = async (QCIQCMasterId, LotCheckMasterId) => {
  try {
    return await axios.get(`${apiName}/get-check-raw/${QCIQCMasterId}/${LotCheckMasterId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkIQCRaw = async (params) => {
  try {
    return await axios.post(`${apiName}/check-raw`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getAllDetailId = async (params) => {
  try {
    return await axios.get(`${apiName}/get-all-detail-id/${params}`);
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

export const PrintMaterialLot = async (params) => {
  try {
    return await axios.post(`${apiName}/print-material-lot`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPOList = async (params) => {
  try {
    return await axios.get(`${apiName}/po-for-select`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
