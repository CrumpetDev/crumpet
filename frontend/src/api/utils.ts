/**
 * Represents the various states of an API call.
 *
 * @template T The type of data expected when the API call is successful.
 */
export type ApiState<T> =
  | { state: 'initial' }
  | { state: 'loading' }
  | { state: 'hasData'; data: T }
  | { state: 'hasError'; error: Error }
  | { state: 'hasDataWithError'; data: T; error: Error };

/**
 * Constructs the 'initial' state for an API call.
 *
 * @template T The type of data expected when the API call is successful.
 * @returns An ApiState object in the 'initial' state.
 */
const initial = <T>(): ApiState<T> => ({ state: 'initial' });

/**
 * Constructs the 'loading' state for an API call.
 *
 * @template T The type of data expected when the API call is successful.
 * @returns An ApiState object in the 'loading' state.
 */
const loading = <T>(): ApiState<T> => ({ state: 'loading' });

/**
 * Constructs the 'hasData' state for an API call.
 *
 * @template T The type of data expected when the API call is successful.
 * @param data The data received from a successful API call.
 * @returns An ApiState object in the 'hasData' state.
 */
const hasData = <T>(data: T): ApiState<T> => ({ state: 'hasData', data });

/**
 * Constructs the 'hasError' state for an API call.
 *
 * @template T The type of data expected when the API call is successful.
 * @param error The error encountered during the API call.
 * @returns An ApiState object in the 'hasError' state.
 */
const hasError = <T>(error: Error): ApiState<T> => ({ state: 'hasError', error });

/**
 * Constructs the 'hasDataWithError' state for an API call.
 *
 * @template T The type of data expected when the API call is successful.
 * @param data The data received from a successful API call.
 * @param error The error encountered during the API call.
 * @returns An ApiState object in the 'hasError' state.
 */
const hasDataWithError = <T>(data: T, error: Error): ApiState<T> => ({
  state: 'hasDataWithError',
  data,
  error,
});

export const ApiState = {
  initial,
  loading,
  hasData,
  hasError,
  hasDataWithError,
};

/**
 * Type guards for ApiState.
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html for details.
 */

export const isHasData = <T>(
  state: ApiState<T>,
): state is
  | { state: 'hasData'; data: T }
  | { state: 'hasDataWithError'; data: T; error: Error } => {
  return state.state === 'hasData' || state.state === 'hasDataWithError';
};

export const isInitial = <T>(state: ApiState<T>): state is { state: 'initial' } =>
  state.state === 'initial';

export const isLoading = <T>(state: ApiState<T>): state is { state: 'loading' } =>
  state.state === 'loading';

export const isHasError = <T>(state: ApiState<T>): state is { state: 'hasError'; error: Error } =>
  state.state === 'hasError';

export const isHasDataWithError = <T>(
  state: ApiState<T>,
): state is { state: 'hasDataWithError'; data: T; error: Error } =>
  state.state === 'hasDataWithError';
