/**
 * Wrapper for chrome messages
 *
 * {@link https://developer.chrome.com/extensions/messaging}
 *
 * @module chrome/msg
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
 * Chrome Messages
 */
export const TYPE = {
    /** highlight the options tab */
    HIGHLIGHT: {
        message: 'highlightTab',
    },
    /** restore default settings for app */
    RESTORE_DEFAULTS: {
        message: 'restoreDefaults',
    },
    /** save to some storage source failed because it would exceed capacity */
    STORAGE_EXCEEDED: {
        message: 'storageExceeded',
    },
    /** save value to local storage */
    STORE: {
        message: 'store',
        key: '',
        value: '',
    },
};
/**
 * Send a chrome message
 *
 * @param type - type of message
 * @throws An error if we failed to connect to the extension
 * @returns Something that is json
 */
export async function send(type) {
    const chromep = new ChromePromise();
    try {
        return await chromep.runtime.sendMessage(type);
    }
    catch (err) {
        if (err.message && !err.message.includes('port closed') && !err.message.includes('Receiving end does not exist')) {
            const msg = `type: ${type.message}, ${err.message}`;
            ChromeGA.error(msg, 'Msg.send');
        }
        throw err;
    }
}
/**
 * Add a listener for chrome messages
 *
 * @param listener - function to receive messages
 */
export function addListener(listener) {
    chrome.runtime.onMessage.addListener(listener);
}
/**
 * Remove a listener for chrome messages
 *
 * @param listener - function to receive messages
 */
export function removeListener(listener) {
    chrome.runtime.onMessage.removeListener(listener);
}
