// To do: Eventually, this file should be broken up into separate files that categorizes the functions

// Used to check if an object with a value of "value" on property "criteria" exists on "list" of type "T"
// Typically used on useState lists of objects
/**
 * @template T - Type of the list
 * @param {T[]}  list - List of objects
 * @param {string} value - Value of object to check if such object exists in the list
 * @param {string} criteria - The property of the value
 * @returns {boolean} - Returns true if object is included within the list
 */
export const isObjectIncluded = <T>(
  list: T[],
  value: string,
  criteria: string,
) =>
  list.filter(function (e) {
    return e[criteria as keyof typeof e] === value;
  }).length > 0;

export function camelCaseToWords(s: string) {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// https://stackoverflow.com/questions/59774572/how-to-get-the-return-type-of-async-function-in-typescript
// ReturnType but for async functions
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;