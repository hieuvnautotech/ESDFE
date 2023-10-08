import { axios } from '@utils';

export const handleLogin = async (userName, userPassword) => {
  try {
    return await axios.post('/api/login/checklogin', {
      userName: userName,
      userPassword: userPassword,
      isOnApp: false,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getUserInfo = async () => {
  try {
    return await axios.get('/api/login/getUserInfo');
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const handleLogout = async () => {
  return await axios.post('/api/logout', {});
};

export const getMenuTab = async (MenuComponent) => {
  try {
    return await axios.get(`/api/login/getMenuTab/${MenuComponent}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

// export {
//     handleLogin,
//     getUserInfo,
//     handleLogout,
// }
