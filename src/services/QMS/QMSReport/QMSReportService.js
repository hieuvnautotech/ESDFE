import { axios } from '@utils';
import { GetLocalStorage } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';

const apiName = '/api/QMSReport';

export const GetIQCRawGeneral = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQCRaw-General`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetIQCRawDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQCRaw-Detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetIQCSlitCutDetail = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQCSlitCut-Detail`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const GetIQCSlitCutGeneral = async (params) => {
  try {
    return await axios.get(`${apiName}/get-IQCSlitCut-General`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getChartIQCRawGeneral = async (params) => {
  try {
    return await axios.get(`${apiName}/get-chart-IQCRaw-General`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getChartIQCSlitCutGeneral = async (params) => {
  try {
    return await axios.get(`${apiName}/get-chart-IQCSlitCut-General`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialList = async (params) => {
  try {
    return await axios.get(`${apiName}/get-material-list`, { params: { ...params } });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getQCStandard = async () => {
  try {
    return await axios.get(`${apiName}/get-QCStandard-IQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getQCItem = async () => {
  try {
    return await axios.get(`${apiName}/get-QCItem-IQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadIQCRaw = async (params) => {
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
      `${ConfigConstants.API_URL}QMSReport/downloadIQCRaw?MaterialId=${params.MaterialId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Type=${params.Type}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'QCIQCRawReport.xlsx';
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

export const downloadIQCRawDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QMSReport/downloadIQCRawDetail?MaterialId=${params.MaterialId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Type=${params.Type}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'QCIQCRawReport.xlsx';
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

export const downloadIQCSlitCut = async (params) => {
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
      `${ConfigConstants.API_URL}QMSReport/downloadIQCSlitCut?MaterialId=${params.MaterialId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Type=${params.Type}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'QCIQCSlitCutReport.xlsx';
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

export const downloadIQCSlitCutDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QMSReport/downloadIQCSlitCutDetail?MaterialId=${params.MaterialId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Type=${params.Type}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'QCIQCSlitCutReport.xlsx';
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
