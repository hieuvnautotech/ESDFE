import { axios } from '@utils';

const apiName = '/api/mold';

const get = async (params) => {
  try {
    return await axios.get(`${apiName}/get`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
const getMoldHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/get-mold-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
const getMoldById = async (params) => {
  try {
    return await axios.get(`${apiName}/get-mold-by-id`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createMold = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyMold = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteMold = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-reuse`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getStatus = async () => {
  try {
    return await axios.get(`${apiName}/get-status`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getStatusCRUD = async () => {
  try {
    return await axios.get(`${apiName}/get-status-crud`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getLineType = async () => {
  try {
    return await axios.get(`${apiName}/get-line-type`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getMoldType = async () => {
  try {
    return await axios.get(`${apiName}/get-type`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
const getProduct = async () => {
  try {
    return await axios.get(`${apiName}/get-product`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getSupplier = async () => {
  try {
    return await axios.get(`${apiName}/get-supplier`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getStaff = async () => {
  try {
    return await axios.get(`${apiName}/get-staff`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getQCMasters = async () => {
  try {
    return await axios.get(`${apiName}/get-qcmasters`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getProductMapping = async (params) => {
  try {
    return await axios.get(`${apiName}/get-product-mapping`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getLineTypeMapping = async (params) => {
  try {
    return await axios.get(`${apiName}/get-linetype-mapping`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getMoldCheckFormMapping = async (params) => {
  try {
    return await axios.get(`${apiName}/get-moldcheck-form-mapping`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getMoldCheckFormHistory = async (params) => {
  try {
    // return await axios.get(`${apiName}/get-qcform-mapping`, { params: params });
    return await axios.get(`${apiName}/get-moldcheck-form-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createMoldCheckFormMapping = async (params) => {
  try {
    return await axios.post(`${apiName}/create-moldcheckform-mapping`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

// const createMoldByExcel = async (params) => {
//   try {
//     return await axios.post(`${apiName}/create-by-excel`, params);
//   } catch (error) {
//     console.log(`ERROR: ${error}`);
//   }
// };

const getCheckMaster = async (MoldId, CheckTime) => {
  try {
    return await axios.get(`${apiName}/get-check/${MoldId}/${CheckTime}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getCheckQC = async (QCMoldMasterId, MoldId, CheckTime) => {
  try {
    return await axios.get(`${apiName}/get-check-qc/${QCMoldMasterId}/${MoldId}/${CheckTime}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const checkQC = async (params) => {
  try {
    return await axios.post(`${apiName}/check-qc`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export {
  get,
  getMoldHistory,
  getMoldById,
  createMold,
  modifyMold,
  deleteMold,
  getStatus,
  getLineType,
  getProduct,
  getSupplier,
  getStaff,
  getQCMasters,
  getProductMapping,
  getLineTypeMapping,
  getMoldCheckFormMapping,
  getMoldCheckFormHistory,
  createMoldCheckFormMapping,
  getMoldType,
  getCheckMaster,
  getCheckQC,
  checkQC,
  getStatusCRUD,
};
