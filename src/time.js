/**
 * Time utilities
 *
 * @module chrome/time
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
/** Default time */
export const DEF_TIME = '00:00';
/** Time Class */
export class ChromeTime {
    /** Milliseconds in minute */
    static get MSEC_IN_MIN() {
        return 60 * 1000;
    }
    /** Minutes in hour */
    static get MIN_IN_HOUR() {
        return 60;
    }
    /** Milliseconds in hour */
    static get MSEC_IN_HOUR() {
        return ChromeTime.MIN_IN_HOUR * 60 * 1000;
    }
    /** Minutes in day */
    static get MIN_IN_DAY() {
        return 60 * 24;
    }
    /** Milliseconds in day */
    static get MSEC_IN_DAY() {
        return ChromeTime.MIN_IN_DAY * 60 * 1000;
    }
    /**
     * Convert string to current time
     *
     * @param timeString - in '00:00' format
     * @returns time in milliSeconds from epoch
     */
    static getTime(timeString) {
        const time = new ChromeTime(timeString);
        const date = new Date();
        date.setHours(time._hr);
        date.setMinutes(time._min);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    }
    /**
     * Calculate time delta from now on a 24hr basis
     *
     * @param timeString - in '00:00' format
     * @returns time delta in minutes
     */
    static getTimeDelta(timeString) {
        const curTime = Date.now();
        const time = ChromeTime.getTime(timeString);
        let delayMin = (time - curTime) / 1000 / 60;
        if (delayMin < 0) {
            delayMin = ChromeTime.MIN_IN_DAY + delayMin;
        }
        return delayMin;
    }
    /**
     * Determine if current time is between start and stop, inclusive
     *
     * @param start - in '00:00' format
     * @param stop - in '00:00' format
     * @returns true if in the given range
     */
    static isInRange(start, stop) {
        const curTime = Date.now();
        const startTime = ChromeTime.getTime(start);
        const stopTime = ChromeTime.getTime(stop);
        let ret = false;
        if (start === stop) {
            ret = true;
        }
        else if (stopTime > startTime) {
            if ((curTime >= startTime) && (curTime <= stopTime)) {
                ret = true;
            }
        }
        else {
            if ((curTime >= startTime) || (curTime <= stopTime)) {
                ret = true;
            }
        }
        return ret;
    }
    /**
     * Get time as string suitable for display, including AM/PM if 12hr
     *
     * @param timeString - in '00:00' format
     * @param format - time format
     * @returns display string
     */
    static getStringFull(timeString, format) {
        const time = new ChromeTime(timeString);
        return time.toString(format);
    }
    /**
     * Get current time suitable for display w/o AM/PM if 12hr
     *
     * @param format = time format
     * @returns display string
     */
    static getStringShort(format) {
        const time = new ChromeTime();
        let timeString = time.toString(format);
        // strip off all non-digits but :
        timeString = timeString.replace(/[^\d:]/g, '');
        // strip off everything after 'xx:xx'
        timeString = timeString.replace(/(.*?:.*?):.*/g, '$1');
        return timeString;
    }
    /**
     * Determine if user wants 24 hr time
     *
     * @param format - time format
     * @returns true for 24 hour time
     */
    static is24Hr(format) {
        let ret = false;
        if (format === 2 /* HR_24 */) {
            ret = true;
        }
        return ret;
    }
    /**
     * Create a new Time
     *
     * @param timeString - optional in '00:00' format, otherwise use current time
     */
    constructor(timeString) {
        this.parse(timeString);
    }
    /**
     * Get string representation of Time
     *
     * @param format - time format
     * @returns As string
     */
    toString(format) {
        const date = new Date();
        date.setHours(this._hr, this._min);
        date.setSeconds(0);
        date.setMilliseconds(0);
        // fallback in case toLocaleTimeString fails - it does sometimes
        let ret = date.toTimeString();
        const languages = [];
        if (navigator.language) {
            languages.push(navigator.language);
        }
        languages.push('en-US');
        const opts = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: !ChromeTime.is24Hr(format),
        };
        try {
            ret = date.toLocaleTimeString(languages, opts);
        }
        catch (err) {
            // ignore;
        }
        return ret;
    }
    /**
     * Parse time string
     *
     * @param timeString - in '00:00' format
     */
    parse(timeString) {
        if (!timeString) {
            const date = new Date();
            this._hr = date.getHours();
            this._min = date.getMinutes();
        }
        else {
            this._hr = parseInt(timeString.substr(0, 2), 10);
            this._min = parseInt(timeString.substr(3, 2), 10);
        }
    }
}
