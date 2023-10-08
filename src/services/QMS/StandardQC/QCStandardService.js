import { axios } from '@utils';

const api = '/api/QCStandard';

export const getQCStandardList = async (params) => {
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
    return await axios.post(`${api}/create-QCStandard`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${api}/modify-QCStandard`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteQCStandard = async (params) => {
  try {
    return await axios.delete(`${api}/delete-redo-QCStandard`, { data: params });
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
export const getQCType = async (params) => {
  try {
    return await axios.get(`${api}/get-qc-type`, {
      params: {
        ...params,
      },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getQCItem = async (params) => {
  try {
    return await axios.get(`${api}/get-qc-item/${params}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
