import { axios } from '@utils';

const api = '/api/QCFrequency';

export const getQCFrequencyList = async (params) => {
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
    return await axios.post(`${api}/create-QCFrequency`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${api}/modify-QCFrequency`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteQCFrequency = async (params) => {
  try {
    return await axios.delete(`${api}/delete-redo-QCFrequency`, { data: params });
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
