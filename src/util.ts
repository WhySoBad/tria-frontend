/**
 * Function to make a debounced function
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns any
 */

export const debounce = <F extends (...args: any[]) => void>(handler: F, delay?: number) => {
  delay = delay || 100;
  let timeoutID: any = null;
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => handler.apply(this, args), delay);
  } as F;
};

/**
 * Function to make a debounced async function
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns Promise<any>
 */

export const debouncedPromise = <F extends (...args: any[]) => Promise<any>>(handler: F, delay?: number) => {
  const debounced = debounce((resolve: any, reject: any, args: Parameters<F>) => {
    handler(...args)
      .then(resolve)
      .catch(reject);
  }, delay);

  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    }) as ReturnType<F>;
};

/**
 * Function to convert a hex color to a hsl object
 *
 * @param hex input hex color
 *
 * @returns object
 */

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  let r: number = parseInt(result[1], 16);
  let g: number = parseInt(result[2], 16);
  let b: number = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  let max: number = Math.max(r, g, b);
  let min: number = Math.min(r, g, b);

  let h: number;
  let s: number;
  let l: number = (max + min) / 2;

  if (max == min) h = s = 0;
  else {
    let d: number = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return { h: h, s: s, l: l };
};
