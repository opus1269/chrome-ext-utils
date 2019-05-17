/**
 * Internationalization methods
 * {@link https://developer.chrome.com/extensions/i18n}
 *
 * @module chrome/locales
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
/**
 * Get the i18n string
 *
 * @param key - key in messages.json
 * @param def - default if no locales
 * @returns internationalized string
 */
export function localize(key, def) {
    let msg = chrome.i18n.getMessage(key);
    if ((msg === undefined) || (msg === '')) {
        // in case localize is missing
        msg = def || '';
    }
    return msg;
}
/**
 * Get the current locale
 *
 * @returns current locale e.g. en_US
 */
export function getLocale() {
    return chrome.i18n.getMessage('@@ui_locale');
}
