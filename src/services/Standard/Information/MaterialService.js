import { axios } from '@utils';
const apiName = '/api/Material';

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
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

export const getSupplier = async (params) => {
  try {
    return await axios.get(`${apiName}/get-supplier`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetIQCMaterial = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQC-Material`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetIQCRawMaterial = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQC-RawMaterial`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const createMaterial = async (params) => {
  try {
    return await axios.post(`${apiName}/create`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modifyMaterial = async (params) => {
  try {
    return await axios.put(`${apiName}/update`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteMaterial = async (params) => {
  try {
    return await axios.delete(`${apiName}/delete`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
