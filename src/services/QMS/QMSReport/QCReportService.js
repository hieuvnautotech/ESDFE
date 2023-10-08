import { axios } from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import { GetLocalStorage } from '@utils';

const apiUrl = '/api/QCReport';

export const getPQCGeneral = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQCGeneral`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCGeneralChart = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQCGeneralChart`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCGeneralView = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQCGeneralView`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getPQCDetail = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getPQCDetail`, { params: params });
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

export const downloadPQCGeneral = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadPQCGeneral?Products=${params.Products}&ModelId=${params.ModelId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const downloadPQCDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadPQCDetail?Products=${params.Products}&ModelId=${params.ModelId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const getModel = async () => {
  try {
    return await axios.get(`${apiUrl}/get-model`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProject = async () => {
  try {
    return await axios.get(`${apiUrl}/get-project`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getProduct = async (params) => {
  try {
    return await axios.get(`${apiUrl}/get-product`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getQCStandard = async () => {
  try {
    return await axios.get(`${apiUrl}/get-QCStandard-PQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getOQCGeneral = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getOQCGeneral`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getOQCGeneralChart = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getOQCGeneralChart`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getOQCDetail = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getOQCDetail`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getQCStandardOQC = async () => {
  try {
    return await axios.get(`${apiUrl}/get-QCStandard-OQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadOQCGeneral = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadOQCGeneral?Products=${params.Products}&ModelId=${params.ModelId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const downloadOQCDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadOQCDetail?Products=${params.Products}&ModelId=${params.ModelId}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const getMaterialGeneral = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getMaterialGeneral`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialGeneralChart = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getMaterialGeneralChart`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getMaterialDetail = async (params) => {
  try {
    return await axios.get(`${apiUrl}/getMaterialDetail`, { params: params });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getQCStandardMaterial = async () => {
  try {
    return await axios.get(`${apiUrl}/get-QCStandard-Material`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const downloadMaterialGeneral = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadMaterialGeneral?MaterialId=${params.MaterialId}&Type=${params.Type}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const downloadMaterialDetail = async (params) => {
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
      `${ConfigConstants.API_URL}QCReport/downloadMaterialDetail?MaterialId=${params.MaterialId}&Type=${params.Type}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&LotorQty=${params.LotorQty}`,
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

export const getQCStandardIQC = async () => {
  try {
    return await axios.get(`${apiUrl}/get-QCStandard-IQC`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
