import { baseHttps } from '../utils/api';

export const getUsers = async () => {
  try {
    const response = await baseHttps.get('/api');
    const { data } = await response;

    // add key data
    const getListUsers = data.map((item, index) => ({ ...item, key: index }));
    return [getListUsers];
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await baseHttps.get(`/api/${id}`);
    const { data } = await response;

    // add key dat
    return { data };
  } catch (error) {
    console.error(error);
  }
};

export const getAllMessages = async () => {
  try {
    const response = await baseHttps.get('/api/messages');
    const { data } = await response;

    // add key dat
    return { data };
  } catch (error) {
    console.error(error);
  }
};
