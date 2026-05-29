import axios from 'axios';
import Swal from 'sweetalert2';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api`;

const ROLE_LABELS = {
  academic_coordinator: 'Coordinador académico',
  teacher: 'Docente',
  student: 'Estudiante',
};

const ROLE_FALLBACK_BY_EMAIL = {
  'coordinator@planify.edu': 'academic_coordinator',
  'teacher@planify.edu': 'teacher',
  'student@planify.edu': 'student',
};

const inferRole = (user = {}) => {
  if (user?.role?.type) return user.role.type;
  if (['academic_coordinator', 'teacher', 'student'].includes(user?.username)) {
    return user.username;
  }
  return ROLE_FALLBACK_BY_EMAIL[user?.email] || '';
};

export async function login(email, password) {
  const authResponse = await axios.post(`${API_BASE_URL}/auth/local`, {
    identifier: email,
    password,
  });

  let user = authResponse.data.user;

  try {
    const userResponse = await axios.get(`${API_BASE_URL}/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${authResponse.data.jwt}`,
      },
    });
    user = userResponse.data || user;
  } catch (error) {
    console.warn('No se pudo cargar el perfil completo del usuario.', error);
  }

  return {
    jwt: authResponse.data.jwt,
    user,
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
  const role = inferRole(user);

  return {
    idToken: jwt,
    jwt,
    user,
    email: user?.email || '',
    username: user?.username || '',
    role,
    roleName: user?.role?.name || ROLE_LABELS[role] || '',
    loggedInAt: new Date().toISOString(),
  };
}

const normalizeStoredToken = (tokenDetails) => {
  const user = tokenDetails?.user || {
    email: tokenDetails?.email,
    username: tokenDetails?.username,
  };
  const role = tokenDetails?.role || inferRole(user);

  return {
    ...tokenDetails,
    user,
    role,
    roleName: tokenDetails?.roleName || ROLE_LABELS[role] || '',
  };
};

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

  const normalizedTokenDetails = normalizeStoredToken(tokenDetails);
  if (JSON.stringify(normalizedTokenDetails) !== tokenDetailsString) {
    saveTokenInLocalStorage(normalizedTokenDetails);
  }

  dispatch(loginConfirmedAction(normalizedTokenDetails));
}
