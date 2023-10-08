import { axios } from '@utils';
const apiName = '/api/Bom';

export const getBomList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBom = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyBom = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteBom = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBomProcessList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-Process`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBomProcess = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyBomProcess = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteBomProcess = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBomProcessMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-Process-material`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBomProcessMaterial = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-material`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createBomProcessMaterialByExcel = async (params) => {
  try {
    return await axios.post(`${apiName}/create-Process-material-by-excel`, params);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyBomProcessMaterial = async (params) => {
  try {
    return await axios.put(`${apiName}/update-Process-material`, { ...params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteBomProcessMaterial = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete-Process-material`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async (ModelId) => {
  try {
    return await axios.get(`${apiName}/get-product-list/${ModelId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProductAll = async () => {
  try {
    return await axios.get(`${apiName}/get-product`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getBuyer = async () => {
  try {
    return await axios.get(`${apiName}/get-buyer-list`);
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

export const getMaterial = async () => {
  try {
    return await axios.get(`${apiName}/get-material-list`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getModelTree = async () => {
  try {
    return await axios.get(`${apiName}/get-model-tree`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
