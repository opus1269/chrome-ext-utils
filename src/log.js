/**
 * Log a message. Will also store the LastError to chrome storage
 *
 * @module chrome/log
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
import * as ChromeGA from './analytics';
import { ChromeLastError } from './last_error';
import * as ChromeLocale from './locales';
import * as ChromeUtils from './utils';
/**
 * Log an error
 *
 * @param msg - override label
 * @param method - override action
 * @param title - a title for the error
 * @param extra - extra info. for analytics
 */
export function error(msg, method, title, extra) {
    msg = msg || ChromeLocale.localize('err_unknown', 'unknown');
    method = method || ChromeLocale.localize('err_unknownMethod', 'unknownMethod');
    title = title || ChromeLocale.localize('err_error', 'An error occurred');
    const gaMsg = extra ? `${msg} ${extra}` : msg;
    ChromeLastError.save(new ChromeLastError(title, msg)).catch(() => { });
    ChromeGA.error(gaMsg, method);
}
/**
 * Log an exception
 *
 * @param err - the exception
 * @param msg - the error message
 * @param fatal - true if fatal
 * @param title - a title for the exception
 */
export function exception(err, msg, fatal, title) {
    try {
        let errMsg = msg;
        if (!errMsg && err && err.message) {
            errMsg = err.message;
        }
        else {
            errMsg = 'Unknown exception';
        }
        title = title || ChromeLocale.localize('err_exception', 'An exception occurred');
        ChromeLastError.save(new ChromeLastError(title, errMsg)).catch(() => { });
        ChromeGA.exception(err, msg, fatal);
    }
    catch (err) {
        if (ChromeUtils.DEBUG) {
            console.error(err); // tslint:disable-line no-console
        }
    }
}
