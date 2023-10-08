import { axios } from '@utils';
const apiName = '/api/HistoryLotTracking';

export const getAll = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getDetailSlit = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-slit`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
