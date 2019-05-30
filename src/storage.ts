/**
 * Manage items in storage
 *
 * @module chrome/storage
 */

/** */

/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */

import * as ChromeGA from './analytics.js';
import * as ChromeJSON from './json.js';
import * as ChromeMsg from './msg.js';

// removeIf(always)
import ChromePromise from 'chrome-promise/chrome-promise';
// endRemoveIf(always)
const chromep = new ChromePromise();

export function get<T>(key: string): null | T;
export function get<T>(key: string, def: boolean): boolean;
export function get<T>(key: string, def: number): number;
export function get<T>(key: string, def: string): string;
export function get<T>(key: string, def: T): T;
/**
 * Get a json parsed value from localStorage
 *
 * @param key - key to get value for
 * @param def - optional value if key not found
 * @returns json object or string, null if key does not exist and no default specified
 */
export function get<T>(key: string, def?: T): null | T {
  const item = localStorage.getItem(key);
  if (item !== null) {
    return ChromeJSON.parse<T>(item) as T;
  } else if (def !== undefined) {
    return def;
  } else {
    return null;
  }
}

/**
 * JSON stringify and save a value to localStorage
 *
 * @param key - key to set value for
 * @param value - new value, if null remove item
 */
export function set<T>(key: string, value: null | T) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    const val = ChromeJSON.stringify<T>(value);
    if (val !== null) {
      localStorage.setItem(key, val);
    }
  }
}

/**
 * Save a value to localStorage only if there is enough room
 *
 * @param key - localStorage Key
 * @param value - value to save
 * @param keyBool - optional key to a boolean value that is true if the primary key has non-empty value
 * @returns true if value was set successfully
 */
export function safeSet<T>(key: string, value: T, keyBool?: string) {
  let ret = true;
  const oldValue = get<T>(key);
  try {
    set(key, value);
  } catch (err) {
    ret = false;
    if (oldValue !== null) {
      // revert to old value
      set(key, oldValue);
    }
    if (keyBool) {
      // revert to old value
      if (oldValue !== null) {
        set(keyBool, true);
      } else {
        set(keyBool, false);
      }
    }
    // notify listeners
    ChromeMsg.send(ChromeMsg.TYPE.STORAGE_EXCEEDED).catch(() => {});
  }
  return ret;
}

export async function asyncGet<T>(key: string): Promise<null | T>;
export async function asyncGet<T>(key: string, def: boolean): Promise<boolean>;
export async function asyncGet<T>(key: string, def: number): Promise<number>;
export async function asyncGet<T>(key: string, def: string): Promise<string>;
export async function asyncGet<T>(key: string, def: T): Promise<T>;
/**
 * Get a value from chrome.storage.local
 *
 * {@link  https://developer.chrome.com/apps/storage}
 *
 * @param key - data key
 * @param def - optional default value if not found
 * @returns value from storage, null if not found unless default is provided
 */
export async function asyncGet<T>(key: string, def?: T): Promise<null | T> {
  let value: null | T = null;
  try {
    const res = await chromep.storage.local.get([key]);
    value = res[key] as T;
  } catch (err) {
    ChromeGA.error(err.message, 'ChromeStorage.asyncGet');
    if (def !== undefined) {
      value = def;
    }
  }

  if (value === undefined) {
    // probably not in storage
    if (def !== undefined) {
      value = def;
    }
  }

  return value;
}

/**
 * Save a value to chrome.storage.local only if there is enough room
 *
 * {@link  https://developer.chrome.com/apps/storage}
 *
 * @param key - data key
 * @param value - data value
 * @param keyBool - optional key to a boolean value that is true if the primary key has non-empty value
 * @returns true if value was set successfully
 */
export async function asyncSet<T>(key: string, value: T, keyBool?: string) {
  // TODO what about keyBool?
  let ret = true;
  const obj = {
    [key]: value,
  };
  try {
    await chromep.storage.local.set(obj);
  } catch (err) {
    // notify listeners save failed
    ChromeMsg.send(ChromeMsg.TYPE.STORAGE_EXCEEDED).catch(() => {});
    ret = false;
  }
  return ret;
}

// const oldValue = get(key);
// try {
//   set(key, value);
// } catch (e) {
//   ret = false;
//   if (oldValue) {
//     // revert to old value
//     set(key, oldValue);
//   }
//   if (keyBool) {
//     // revert to old value
//     if (oldValue && oldValue.length) {
//       set(keyBool, true);
//     } else {
//       set(keyBool, false);
//     }
//   }
//   // notify listeners
//   ChromeMsg.send(ChromeMsg.TYPE.STORAGE_EXCEEDED).catch(() => {});
// }

// return ret;
