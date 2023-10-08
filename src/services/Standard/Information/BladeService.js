import { axios } from '@utils';

const apiName = '/api/blade';

const get = async (params) => {
  try {
    return await axios.get(`${apiName}/get`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getbladeById = async (params) => {
  try {
    return await axios.get(`${apiName}/get-blade-by-id`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createBlade = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Blade`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const modifyBlade = async (params) => {
  try {
    return await axios.put(`${apiName}/modify-Blade`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const deleteBlade = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-reuse-Blade`, { data: params });
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

const getLine = async () => {
  try {
    return await axios.get(`${apiName}/get-line`);
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

const getbladeCheckFormMapping = async (params) => {
  try {
    return await axios.get(`${apiName}/get-bladecheck-form-mapping`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getbladeCheckFormHistory = async (params) => {
  try {
    // return await axios.get(`${apiName}/get-qcform-mapping`, { params: params });
    return await axios.get(`${apiName}/get-bladecheck-form-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const createbladeCheckFormMapping = async (params) => {
  try {
    return await axios.post(`${apiName}/create-bladecheck-form-mapping`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const getBladeHistory = async (params) => {
  try {
    return await axios.get(`${apiName}/get-blade-history`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

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
  getbladeById,
  createBlade,
  modifyBlade,
  deleteBlade,
  getStatus,
  getLine,
  getProduct,
  getSupplier,
  getStaff,
  getQCMasters,
  getProductMapping,
  getLineTypeMapping,
  getbladeCheckFormMapping,
  getbladeCheckFormHistory,
  createbladeCheckFormMapping,
  getBladeHistory,
  getCheckQC,
  checkQC,
  getCheckMaster,
};
