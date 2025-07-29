// api/registerUser.ts
import axios from 'axios';

export const registerUser = async ({ username, email, password }) => {
  console.log({username, email, password})
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

// api/loginUser.ts
export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};
