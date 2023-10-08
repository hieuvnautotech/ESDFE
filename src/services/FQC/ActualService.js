import { axios } from '@utils';
const apiName = '/api/Actual';

export const getWOList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getWOProcessList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-Process`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async () => {
  try {
    return await axios.get(`${apiName}/get-product`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBom = async (productId) => {
  try {
    return await axios.get(`${apiName}/get-bom/${productId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getStaff = async () => {
  try {
    return await axios.get(`${apiName}/get-staff`);
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

export const getValueCheck = async (WOProcessId) => {
  try {
    return await axios.get(`${apiName}/get-value-check-pqc/${WOProcessId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkPQC = async (params) => {
  try {
    return await axios.post(`${apiName}/check-PQC`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Process
export const createProcess = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteProcessFQC = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process-fqc`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Process Staff
export const getWOProcessStaffList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-Process-staff`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createProcessStaff = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-staff`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteProcessStaff = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process-staff`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyProcessStaff = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process-staff`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//WO semi lot
export const getWOSemiLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-semi-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//WO semiLot FQC
export const getWOSemiLotFQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-fqc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createSemiLot = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSemiLot = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-semi-lot`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPrintInfo = async (WOSemiLotFQCId) => {
  try {
    return await axios.get(`${apiName}/get-print/${WOSemiLotFQCId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//WO semiLot FQC Detail
export const getWOSemiLotDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-fqc-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialLotCodeList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wo-materialLot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createSemiLotDetail = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteSemiLotDetail = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-semi-lot-detail`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const stopInheritanceSemiLotDetail = async (params) => {
  try {
    return await axios.put(`${apiName}/stopInheritance-semi-lot-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//check QC
export const getWOSemiLotQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-fqc-detail-qc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteWOSemiLotQC = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-wosemilot-detail-qc`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createWOSemiLotQC = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot-detail-qc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getSemilotWaitOQCList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wait-semilot-oqc-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createSemiLotWaitOQC = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot-wait-oqc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getSemiLotOQCList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-semilot-oqc-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteSemiLotOQC = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-semi-lot-oqc`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getFQCQCDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-qc-list-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Check OQC
export const getWOSemiCheckOQC = async (params) => {
  try {
    return await axios.get(`${apiName}/get-check-oqc`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const checkOQC = async (params) => {
  try {
    return await axios.post(`${apiName}/check-oqc`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Add replacement
export const getWOSemiLotListReplace = async (params) => {
  try {
    return await axios.get(`${apiName}/get-semi-lot-replacment`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createSemiLotReplacement = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot-replacement`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
