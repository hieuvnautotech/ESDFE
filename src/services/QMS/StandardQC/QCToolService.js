import { axios } from '@utils';

const api = '/api/QCTool';

export const getQCToolList = async (params) => {
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
    return await axios.post(`${api}/create-QCTool`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const modify = async (params) => {
  try {
    return await axios.put(`${api}/modify-QCTool`, {
      ...params,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const deleteQCTool = async (params) => {
  try {
    return await axios.delete(`${api}/delete-redo-QCTool`, { data: params });
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
export const getQCStandard = async (QCTypeId, QCItemId) => {
  try {
    return await axios.get(`${api}/get-qc-standard/${QCTypeId}/${QCItemId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getQCTool = async (QCTypeId, QCItemId, QCStandardId) => {
  try {
    return await axios.get(`${api}/get-qc-tool`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
