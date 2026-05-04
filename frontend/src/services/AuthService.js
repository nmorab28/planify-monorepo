import axios from 'axios';
import Swal from 'sweetalert2';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export async function login(email, password) {
  const authResponse = await axios.post(`${API_BASE_URL}/auth/local`, {
    identifier: email,
    password,
  });

  return {
    jwt: authResponse.data.jwt,
    user: authResponse.data.user,
  };
}

// Se deja comentado por si más adelante vuelven a usar registro
// export function signUp(email, password) {
//     return axios.post(`${API_BASE_URL}/auth/local/register`, {
//         username: email,
//         email,
//         password,
//     });
// }

export function formatError(errorResponse) {
  const backendMessage =
    errorResponse?.response?.data?.error?.message ||
    errorResponse?.message ||
    'Authentication failed';

  Swal.fire({
    icon: 'error',
    title: 'Oops',
    text: backendMessage,
  });

  return backendMessage;
}

export function normalizeAuthData(authData) {
  const jwt = authData.jwt;
  const user = authData.user;

  return {
    idToken: jwt,
    jwt,
    user,
    email: user?.email || '',
    username: user?.username || '',
    role: user?.role?.type || '',
    roleName: user?.role?.name || '',
    loggedInAt: new Date().toISOString(),
  };
}

export function saveTokenInLocalStorage(tokenDetails) {
  localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem('userDetails');

  if (!tokenDetailsString) {
    dispatch(Logout(navigate));
    return;
  }

  const tokenDetails = JSON.parse(tokenDetailsString);

  if (!tokenDetails?.idToken) {
    dispatch(Logout(navigate));
    return;
  }

  dispatch(loginConfirmedAction(tokenDetails));
}
