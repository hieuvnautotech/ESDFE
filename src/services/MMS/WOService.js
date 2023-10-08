import { axios } from '@utils';
const apiName = '/api/WO';

export const getWOList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createWO = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyWO = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteWO = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const finishWO = async (params) => {
  try {
    return await axios.delete(`${apiName}/finish`, { data: params });
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

export const createWOProcess = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyWOProcess = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteWOProcess = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process`, { data: params });
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

export const getStaffQC = async () => {
  try {
    return await axios.get(`${apiName}/get-staff-check`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

//Process Mold
export const getWOProcessMoldList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-process-mold`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getWOProcessMoldListDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-process-mold-detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getMold = async (WOProcessId) => {
  try {
    return await axios.get(`${apiName}/get-mold/${WOProcessId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createProcessMold = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-mold`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createProcessMoldDup = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-Mold-Dup`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteProcessMold = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process-mold`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const modifyProcessMold = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process-mold`, { ...params });
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
//Process Line
export const getWOProcessLineList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-Process-Line`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createProcessLine = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-Line`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createProcessLineDup = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-Line-Dup`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const deleteProcessLine = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process-Line`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const modifyProcessLine = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process-Line`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getLine = async () => {
  try {
    return await axios.get(`${apiName}/get-line`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Process Mold line staff
export const getWOProcessMoldStaffLineList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-process-mold-staff-line`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getCheckNewMoldWorkerMachine = async (params) => {
  try {
    return await axios.get(`${apiName}/get-check-mold-staff-line/${params}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//WO semiLot MMS
export const getWOSemiLotMMS = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-mms`, { params: { ...params } });
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
export const modifyWOSemiLotQuantity = async (params) => {
  try {
    return await axios.put(`${apiName}/update-semilot-quantity`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createWOMoldPressingTime = async (params) => {
  try {
    return await axios.put(`${apiName}/create-wo-mold-pressingtime`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const updateWOMoldPressingTime = async (params) => {
  try {
    return await axios.put(`${apiName}/update-wo-mold-pressingtime`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//Check PQC SL
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

export const getPrintInfo = async (WOSemiLotMMSId) => {
  try {
    return await axios.get(`${apiName}/get-print/${WOSemiLotMMSId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//WO semiLot MMS Detail
export const getWOSemiLotDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-mms-detail`, { params: { ...params } });
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
export const getSemilotList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wo-semilot`, { params: { ...params } });
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
export const createSemiLotDetailSemi = async (params) => {
  try {
    return await axios.post(`${apiName}/create-semi-lot-detail-semi`, { ...params });
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
export const finishSemiLotDetail = async (params) => {
  try {
    return await axios.put(`${apiName}/finish-semi-lot-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const returnSemiLotDetail = async (params) => {
  try {
    return await axios.put(`${apiName}/return-semi-lot-detail`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
// List material lot code by BOM
export const getListMateialLotByBOM = async (params) => {
  try {
    return await axios.get(`${apiName}/get-list-materialLotCode-ByBom`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProcess = async () => {
  try {
    return await axios.get(`${apiName}/get-process-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
//PressLot
export const getWOSemiLotPressLot = async (params) => {
  try {
    return await axios.get(`${apiName}/get-wosemilot-presslot-mms`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const createPressLot = async (params) => {
  try {
    return await axios.post(`${apiName}/create-press-lot`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getWOProcessPressLotList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-press-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const unMapping = async (params) => {
  try {
    return await axios.put(`${apiName}/unMapping`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
