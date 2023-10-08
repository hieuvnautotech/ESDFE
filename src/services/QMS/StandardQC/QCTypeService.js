import { axios } from '@utils';

const api = '/api/QCType';

export const getQCTypeList = async (params) => {
  try {
    return await axios.get(`${api}/get-all`, {
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
    return await axios.post(`${api}/create-QCType`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${api}/modify-QCType`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteStandardQC = async (params) => {
  try {
    return await axios.delete(`${api}/delete-redo-QCType`, { data: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getQCApply = async (params) => {
  try {
    return await axios.get(`${api}/get-qc-apply`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
