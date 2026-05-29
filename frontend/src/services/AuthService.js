import axios from 'axios';
import Swal from 'sweetalert2';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api`;

export async function login(email, password) {
  const authResponse = await axios.post(`${API_BASE_URL}/auth/local`, {
    identifier: email,
    password,
  });

  const userResponse = await axios.get(`${API_BASE_URL}/users/me?populate=role`, {
    headers: {
      Authorization: `Bearer ${authResponse.data.jwt}`,
    },
  });

  return {
    jwt: authResponse.data.jwt,
    user: userResponse.data || authResponse.data.user,
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
    'No se pudo iniciar sesión';

  Swal.fire({
    icon: 'error',
    title: 'Error de autenticación',
    text: backendMessage,
  });

  return backendMessage;
}

export function normalizeAuthData(authData) {
  const jwt = authData.jwt;
  const user = authData.user;
  const roleFallbackByEmail = {
    'coordinator@planify.edu': 'academic_coordinator',
    'teacher@planify.edu': 'teacher',
    'student@planify.edu': 'student',
  };
  const role =
    user?.role?.type ||
    (['academic_coordinator', 'teacher', 'student'].includes(user?.username)
      ? user.username
      : roleFallbackByEmail[user?.email] || '');

  return {
    idToken: jwt,
    jwt,
    user,
    email: user?.email || '',
    username: user?.username || '',
    role,
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
