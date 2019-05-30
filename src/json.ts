/**
 * JSON utilities
 *
 * @module chrome/json
 */

/** */

/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */

import * as ChromeGA from './analytics.js';

/**
 * Parse json, with exception handling
 *
 * @param jsonString - string to parse
 * @returns json object, null on error
 */
export function parse<T>(jsonString: string): null | T {
  let ret: T | null = null;
  try {
    ret = JSON.parse(jsonString);
  } catch (err) {
    ChromeGA.error(err.message, 'ChromeJSON.parse');
  }
  return ret;
}

/**
 * Stringify json, with exception handling
 *
 * @param jsonifiable - object to stringify
 * @returns string, null on error
 */
export function stringify<T>(jsonifiable: T) {
  let ret = null;
  try {
    ret = JSON.stringify(jsonifiable);
  } catch (err) {
    ChromeGA.error(err.message, 'ChromeJSON.stringify');
  }
  return ret;
}

/**
 * Create a shallow copy of an object
 *
 * @param jsonifiable - object to copy
 * @throws An error if copy failed
 * @returns shallow copy of input
 */
export function shallowCopy<T>(jsonifiable: T) {
  const jsonString = stringify(jsonifiable);
  if (jsonString !== null) {
    return JSON.parse(jsonString) as T;
  } else {
    const msg = `Failed to copy: ${jsonifiable}`;
    ChromeGA.error(msg, 'ChromeJSON.shallowCopy');
    throw new Error(msg);
  }
}
