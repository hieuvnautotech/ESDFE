import { axios } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import { GetLocalStorage } from '@utils';
import moment from 'moment';

const apiName = '/api/Effective';

export const getWO = async (params) => {
  try {
    return await axios.get(`${apiName}/getWO`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetValueMMS = async (params) => {
  try {
    return await axios.get(`${apiName}/getValueMMS`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetValueFQC = async (params) => {
  try {
    return await axios.get(`${apiName}/getValueFQC`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetProcessMMS = async (WOId) => {
  try {
    return await axios.get(`${apiName}/getProcessMMS/${WOId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetProcessFQC = async (WOId) => {
  try {
    return await axios.get(`${apiName}/getProcessFQC/${WOId}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const download = async (data) => {
  try {
    const token = GetLocalStorage(ConfigConstants.TOKEN_ACCESS);
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `${ConfigConstants.API_URL}Effective/download?ProductId=${data.ProductId}&ProductCode=${
        data.ProductCode
      }&ModelCode=${data.ModelCode}&Target=${data.Target}&MMSCode=${data.ProcessCodeMMS}&FQCCode=${
        data.ProcessCodeFQC
      }&StartDate=${moment(data.StartDate).format('YYYY-MM-DD')}&EndDate=${moment(data.EndDate).format('YYYY-MM-DD')}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'DisplayReport.xlsx';
        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      });
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
