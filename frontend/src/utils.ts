/**
 * Utility function to get the first letter of a string.
 * 
 * @param str - The input string.
 * @returns The first letter of the string, or '' if the string is null or empty.
 */
export const getFirstLetter = (str: string | null | undefined): string => {
  return str && str.length > 0 ? str.charAt(0) : '';
}
