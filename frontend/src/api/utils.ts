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
