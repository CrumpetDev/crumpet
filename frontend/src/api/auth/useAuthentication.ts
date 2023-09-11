import { useContext, useState, createContext } from 'react';
import { TokenApi, defaultConfig } from 'api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export interface credentials {
  email: string;
  password: string;
}

interface TokenContextProps {
  accessToken?: string;
  refreshToken?: string;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

const TokenContext = createContext<TokenContextProps>({
  accessToken: undefined,
  refreshToken: undefined,
  setAccessToken: () => true,
  setRefreshToken: () => true,
});

export const useAuthentication = () => {
  const navigate = useNavigate();
  const tokenApi = new TokenApi(defaultConfig);
  const { accessToken, setAccessToken } = useContext(TokenContext);
  const [authenticating, setAuthenticating] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');
  const [cookies, setCookies, removeCookies] = useCookies(['refreshToken']);
  const [refreshToken, setRefreshToken] = useState(cookies.refreshToken);
  const [authenticated, setAuthenticated] = useState(false);

  const login = async ({ email, password }: credentials) => {
    setAuthenticating(true);
    return await tokenApi
      .createTokenObtainPair({
        email: email,
        password,
      })
      .then(async response => {
        // @ts-ignore
        if (!response.data?.access || !response.data?.refresh) {
          setErrorAlert('Login failed');
          return { success: false, errors: ['Login Failed - Invalid Response'] };
        }
        // @ts-ignore
        setCookies('refreshToken', response.data.refresh);
        // @ts-ignore
        setRefreshToken(response.data.refresh);
        setAuthenticated(true);
        // @ts-ignore
        setAccessToken(response.data.access);
        return { success: true, errors: [] };
      })
      .catch(error => {
        setAuthenticating(false);
        if (error.response && error.response.status === 401) {
          setErrorAlert('Invalid credentials');
          return { success: false, errors: ['Invalid credentials'] };
        } else {
          setErrorAlert('Login failed - Server Error');
          return { success: false, errors: ['Login Failed - Server Error'] };
        }
      })
      .finally(() => {
        setAuthenticating(false);
      });
  };

  const checkAuth = async () => {
    if (accessToken && refreshToken) {
      return await tokenApi
        .createTokenVerify({
          token: accessToken,
        })
        .then(() => {
          return true;
        })
        .catch(() => {
					//NOTE: Should we not await the response from tokenRefresh before returning false?
          tokenRefresh();
          return false;
        });
    } else {
      return false;
    }
  };

  const tokenRefresh = async () => {
    return await tokenApi
      .createTokenRefresh({
        refresh: refreshToken || 'noToken',
      })
      .then(async response => {
        if (response?.data.access) {
          setAccessToken(response.data.access);
          return response.data.access;
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      });
  };

  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${defaultConfig.basePath}/token/refresh/`
      ) {
        logout();
        return Promise.reject(error);
      } else if (originalRequest.url === `${defaultConfig.basePath}/token/`) {
        return Promise.reject(error);
      } else if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await tokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
      return Promise.reject(error);
    },
  );

  const logout = () => {
    removeCookies('refreshToken');
    setAccessToken('');
    setAuthenticated(false);
    navigate('/login');
  };

  return {
    login,
    logout,
    authenticating,
    setErrorAlert,
    errorAlert,
    tokenRefresh,
    checkAuth,
    authenticated,
  };
};
export { TokenContext };
export default useAuthentication;
