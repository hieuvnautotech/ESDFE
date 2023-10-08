import { axios } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import { GetLocalStorage } from '@utils';

const apiUrl = '/api/QCFQCReport';

export const getFQCGeneral = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getFQCGeneral`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCGeneralChart = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getFQCGeneralChart`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
export const getQCStandard = async () => {
  try {
    return await axios.get(`${apiUrl}/get-QCStandard-FQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCDetail = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getFQCDetail`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCDetailChart = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQCDetailChart`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadFQCGeneral = async (params) => {
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
      `${ConfigConstants.API_URL}QCFQCReport/downloadFQCGeneral?Products=${params.Products}&ModelId=${params.ModelId}&ProjectId=${params.ProjectId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'Report.xlsx';
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

export const downloadFQCDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QCFQCReport/downloadFQCDetail?Products=${params.Products}&ModelId=${params.ModelId}&ProjectId=${params.ProjectId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'Report.xlsx';
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
