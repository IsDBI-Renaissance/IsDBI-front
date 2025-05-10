// api/registerUser.ts
import axios from 'axios';

export const registerUser = async ({ name, email, password }) => {
  const response = await axios.post('http://localhost:5000/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

// api/loginUser.ts
export const loginUser = async ({ email, password }) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

