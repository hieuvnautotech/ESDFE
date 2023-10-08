import { axios } from '@utils';

const apiName = 'api/PO';

export const get = async (params) => {
  try {
    return await axios.get(`${apiName}`, {
      params: { ...params },
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
