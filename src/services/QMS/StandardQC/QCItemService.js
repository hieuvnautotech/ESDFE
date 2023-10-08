import { axios } from '@utils';

const api = '/api/QCItem';

export const getQCItemList = async (params) => {
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
    return await axios.post(`${api}/create-QCItem`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${api}/modify-QCItem`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteQCItem = async (params) => {
  try {
    return await axios.delete(`${api}/delete-redo-QCItem`, { data: params });
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
