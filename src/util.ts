/**
 * Function to make a debounced function
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns any
 */

export const debounce = (handler: (...args: any[]) => any, delay: number): any => {
  let timeout: NodeJS.Timeout;
  return function (...args: Array<any>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      handler.apply(context, args);
    }, delay);
  };
};

/**
 * Function to make a debounced async function
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns Promiseany>
 */

export const debouncedPromise = (handler: (...args: any[]) => Promise<any>, delay: number): (() => ReturnType<typeof handler>) => {
  let timeout: NodeJS.Timeout;
  let resolves: Array<(value?: unknown) => void> = [];

  return async (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const result = handler(...args);
      resolves.forEach((resolve) => resolve(result));
      resolves = [];
    }, delay);

    return new Promise((resolve) => resolves.push(resolve));
  };
};
