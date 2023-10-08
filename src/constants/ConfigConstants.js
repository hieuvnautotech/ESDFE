// export const API_URL = 'https://localhost:44304/api/';
// export const BASE_URL = 'https://localhost:44304';

// export const API_URL = 'http://192.168.5.194:55/api/';
// export const BASE_URL = 'http://192.168.5.194:55';

export const API_URL = process.env.API_URL;
export const BASE_URL = process.env.BASE_URL;

export const LOGIN_URL = '/api/login/checklogin';
export const REFRESH_TOKEN_URL = '/api/refreshtoken';

const company = '_ESD';

const accessTokenKey = `access-token${company}`;
const refreshAccessTokenKey = `refresh-token${company}`;

export const CURRENT_USER = 'CURRENT_USER' + company;
export const TOKEN_ACCESS = accessTokenKey;
export const TOKEN_REFRESH = refreshAccessTokenKey;
export const LANG_CODE = 'LANG_CODE' + company;

//Action
export const VIEW_ACTION = 'View';
export const CREATE_ACTION = 'Create';
export const UPDATE_ACTION = 'Update';
export const DELETE_ACTION = 'Delete';
