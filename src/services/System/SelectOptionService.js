import { axios } from '@utils';
const apiName = '/api/SelectOption';

export const getStaff = async () => {
  try {
    return await axios.get(`${apiName}/get-staff`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
