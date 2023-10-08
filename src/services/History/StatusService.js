import { axios } from '@utils';
const apiName = '/api/HistoryStatus';

export const getMaterialLotCode = async (params) => {
  try {
    return await axios.get(`${apiName}/get-status-by-materialLotcode`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
