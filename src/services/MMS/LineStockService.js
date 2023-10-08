import { axios } from '@utils';
const apiName = '/api/LineStock';

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialLotList = async (params) => {
  try {
    return await axios.get(`${apiName}/detail-lot`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
