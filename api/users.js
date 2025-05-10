// api/registerUser.ts
import axios from 'axios';

export const registerUser = async ({ name, email, password }) => {
  const response = await axios.post('http://localhost:3000/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

// api/loginUser.ts
export const loginUser = async ({ email, password }) => {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email,
    password,
  });
  return response.data;
};

