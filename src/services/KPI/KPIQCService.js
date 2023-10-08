import { axios } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import { GetLocalStorage } from '@utils';

const apiUrl = '/api/KPIQC';

export const getPQC6Days = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCCurrentDate = async (params) => {
  try {
    return await axios.get(`${apiUrl}/currentPQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadPQC = async (params) => {
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
      `${ConfigConstants.API_URL}KPIQC/downloadPQC?ProductId=${params.ProductId}&WOCode=${params.WOCode}&ProcessCode=${params.ProcessCode}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'KPIPQCReport.xlsx';
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

export const getFQC6Days = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getFQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getFQCCurrentDate = async (params) => {
  try {
    return await axios.get(`${apiUrl}/currentFQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadFQC = async (params) => {
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
      `${ConfigConstants.API_URL}KPIQC/downloadFQC?ProductId=${params.ProductId}&WOCode=${params.WOCode}&ProcessCode=${params.ProcessCode}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'KPIFQCReport.xlsx';
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

export const getOQC6Days = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getOQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getOQCCurrentDate = async (params) => {
  try {
    return await axios.get(`${apiUrl}/currentOQC`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadOQC = async (params) => {
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
      `${ConfigConstants.API_URL}KPIQC/downloadOQC?ProductId=${params.ProductId}&WOCode=${params.WOCode}&ProcessCode=${params.ProcessCode}`,
      options
    ).then((response) => {
      response.blob().then((blob) => {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'KPIOQCReport.xlsx';
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
