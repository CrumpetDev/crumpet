import { useContext, useEffect, useMemo } from 'react';
import { Configuration } from './schema';
import { useAuthentication, TokenContext } from './auth/useAuthentication';
import axios from 'axios';

export const baseUrl = () => {
  if (import.meta.env.VITE_REACT_APP_ENVIRONMENT === 'debug') {
    return 'http://localhost:8000';
  } else {
    return process.env.VITE_REACT_APP_API_URL;
  }
};

const defaultConfig = new Configuration({
  basePath: baseUrl(),
});

export const useApiConfig = () => {
  const { accessToken } = useContext(TokenContext);
  const config = useMemo(() => new Configuration({ basePath: baseUrl() }), []);

  useEffect(() => {
    config.baseOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }, [accessToken, config]);

  const uploadFile = async (formData: FormData, endpoint: string) => {
    return axios.post(`${baseUrl()}/${endpoint}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return {
    config,
    uploadFile,
  };
};
export { useAuthentication, defaultConfig, TokenContext };
export * from './schema';
