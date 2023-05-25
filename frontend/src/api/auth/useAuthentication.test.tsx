import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { useAuthentication, TokenContext } from 'api';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import React from 'react';

vi.mock('axios');
vi.mock('react-cookie');
// @ts-ignore
const mockedAxios = axios as vi.Mocked<typeof axios>;
// @ts-ignore
const mockedUseCookies = useCookies as vi.Mocked<typeof useCookies>;

const mockedTokenContext = {
  accessToken: undefined,
  refreshToken: undefined,
  setAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
};

interface Props {
  children: React.ReactNode;
}

const testContainer = ({ children }: Props) => (
  <TokenContext.Provider value={mockedTokenContext}>
    <MemoryRouter>{children}</MemoryRouter>
  </TokenContext.Provider>
);

const render = () => {
  return renderHook(() => useAuthentication(), {
    wrapper: testContainer,
  });
};

describe('useAuthentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const setCookie = vi.fn();
    const removeCookie = vi.fn();

    mockedUseCookies.mockReturnValue([{ cookieName: 'cookieValue' }, setCookie, removeCookie]);
  });

  it('should return the correct value', () => {
    const { result } = render();
    expect(result.current.errorAlert).toBe('');
  });

  it('should login successfully', async () => {
    const { result } = render();

    mockedAxios.request.mockResolvedValue({
      data: {
        access: 'access',
        refresh: 'refresh',
      },
    });

    await act(async () => {
      const response = await result.current.login({
        email: 'test@gmail.com',
        password: 'password',
      });
      expect(response).toEqual({ success: true, errors: [] });
    });
    expect(result.current.errorAlert).toBe('');
    expect(mockedTokenContext.setAccessToken).toBeCalledWith('access');
    expect(mockedUseCookies()[1]).toBeCalledWith('refreshToken', 'refresh');
  });

  it('should fail to login with readable message when 401 is returned', async () => {
    const { result } = render();

    mockedAxios.request.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    await act(async () => {
      const response = await result.current.login({
        email: 'test@gmail.com',
        password: 'password',
      });
      expect(response).toEqual({ success: false, errors: ['Invalid credentials'] });
    });
    expect(result.current.errorAlert).toBe('Invalid credentials');
    expect(mockedTokenContext.setAccessToken).not.toBeCalled();
    expect(mockedUseCookies()[1]).not.toBeCalled();
  });

  it('should fail to login with readable message when 500 is returned', async () => {
    const { result } = render();

    mockedAxios.request.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    await act(async () => {
      const response = await result.current.login({
        email: 'test@gmail.com',
        password: 'password',
      });
      expect(response).toEqual({ success: false, errors: ['Login Failed - Server Error'] });
    });
    expect(mockedTokenContext.setAccessToken).not.toBeCalled();
    expect(mockedUseCookies()[1]).not.toBeCalled();
  });

  it('should fail to login with readable message when no response is returned', async () => {
    const { result } = render();

    mockedAxios.request.mockRejectedValue({
      response: undefined,
    });

    await act(async () => {
      const response = await result.current.login({
        email: 'test@gmail.com',
        password: 'password',
      });
      expect(response).toEqual({ success: false, errors: ['Login Failed - Server Error'] });
    });
    expect(mockedTokenContext.setAccessToken).not.toBeCalled();
    expect(mockedUseCookies()[1]).not.toBeCalled();
  });

  it('should logout successfully', async () => {
    const { result } = render();

    await act(async () => {
      await result.current.logout();
    });
    expect(mockedTokenContext.setAccessToken).toBeCalledWith('');
    expect(mockedUseCookies()[2]).toBeCalledWith('refreshToken');
  });

  it('should refresh successfully with valid refresh token', async () => {
    const { result } = render();

    mockedAxios.request.mockResolvedValue({
      data: {
        access: 'access',
      },
    });

    await act(async () => {
      const response = await result.current.tokenRefresh();
      expect(response).toEqual('access');
    });
    expect(result.current.errorAlert).toBe('');
    expect(mockedTokenContext.setAccessToken).toBeCalledWith('access');
  });

  it('should fail to refresh with logout message when 401 is returned', async () => {
    const { result } = render();

    mockedAxios.request.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    await act(async () => {
      const response = await result.current.tokenRefresh();
      expect(response).toEqual(undefined);
    });
    expect(mockedTokenContext.setAccessToken).toBeCalledWith('');
    expect(mockedUseCookies()[2]).toBeCalledWith('refreshToken');
  });
});
