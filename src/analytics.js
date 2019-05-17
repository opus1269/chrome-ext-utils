/**
 * Google Analytics tracking
 *
 * @module chrome/analytics
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
import * as ChromeJSON from './json.js';
import * as ChromeUtils from './utils.js';
/** Event types */
export const EVENT = {
    /** Extension installed */
    INSTALLED: {
        eventCategory: 'extension',
        eventAction: 'installed',
        eventLabel: '',
    },
    /** Extension updated */
    UPDATED: {
        eventCategory: 'extension',
        eventAction: 'updated',
        eventLabel: '',
    },
    /** Cached OAuth2 token refreshed */
    REFRESHED_AUTH_TOKEN: {
        eventCategory: 'user',
        eventAction: 'refreshedAuthToken',
        eventLabel: '',
    },
    /** Chrome alarm triggered */
    ALARM: {
        eventCategory: 'alarm',
        eventAction: 'triggered',
        eventLabel: '',
    },
    /** Menu item selected */
    MENU: {
        eventCategory: 'ui',
        eventAction: 'menuSelect',
        eventLabel: '',
    },
    /** Toggle state changed */
    TOGGLE: {
        eventCategory: 'ui',
        eventAction: 'toggle',
        eventLabel: '',
    },
    /** Url link clicked */
    LINK: {
        eventCategory: 'ui',
        eventAction: 'linkSelect',
        eventLabel: '',
    },
    /** Text changed */
    TEXT: {
        eventCategory: 'ui',
        eventAction: 'textChanged',
        eventLabel: '',
    },
    /** Slider value changed */
    SLIDER_VALUE: {
        eventCategory: 'ui',
        eventAction: 'sliderValueChanged',
        eventLabel: '',
    },
    /** Slider unit changed */
    SLIDER_UNITS: {
        eventCategory: 'ui',
        eventAction: 'sliderUnitsChanged',
        eventLabel: '',
    },
    /** Button clicked */
    BUTTON: {
        eventCategory: 'ui',
        eventAction: 'buttonClicked',
        eventLabel: '',
    },
    /** Radio button clicked */
    RADIO_BUTTON: {
        eventCategory: 'ui',
        eventAction: 'radioButtonClicked',
        eventLabel: '',
    },
    /** Toolbar icon clicked */
    ICON: {
        eventCategory: 'ui',
        eventAction: 'toolbarIconClicked',
        eventLabel: '',
    },
    /** Item clicked */
    CLICK: {
        eventCategory: 'ui',
        eventAction: 'click',
        eventLabel: '',
    },
    /** Checkbox clicked */
    CHECK: {
        eventCategory: 'ui',
        eventAction: 'checkBoxClicked',
        eventLabel: '',
    },
    /** Image button clicked */
    IMAGE_BUTTON: {
        eventCategory: 'ui',
        eventAction: 'imageButtonClicked',
        eventLabel: '',
    },
    /** Fab button clicked */
    FAB_BUTTON: {
        eventCategory: 'ui',
        eventAction: 'fabButtonClicked',
        eventLabel: '',
    },
    /** Keyboard shortcut entered */
    KEY_COMMAND: {
        eventCategory: 'ui',
        eventAction: 'keyCommand',
        eventLabel: '',
    },
};
/**
 * Initialize analytics
 *
 * @param trackingId - tracking id
 * @param appName - extension name
 * @param appId - extension Id
 * @param appVersion - extension version
 */
export function initialize(trackingId, appName, appId, appVersion) {
    // Standard Google Universal Analytics code
    // @ts-ignore
    (function (i, s, o, g, r, a, m) {
        // @ts-ignore
        i['GoogleAnalyticsObject'] = r; // tslint:disable-line no-string-literal
        // @ts-ignore
        // noinspection CommaExpressionJS
        i[r] = i[r] || function () {
            // @ts-ignore
            (i[r].q = i[r].q || []).push(arguments);
            // @ts-ignore
        }, i[r].l = 1 * new Date();
        // @ts-ignore
        // noinspection CommaExpressionJS
        a = s.createElement(o),
            // @ts-ignore
            m = s.getElementsByTagName(o)[0];
        // @ts-ignore
        a.async = 1;
        // @ts-ignore
        a.src = g;
        // @ts-ignore
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', trackingId, 'auto');
    // see: http://stackoverflow.com/a/22152353/1958200
    ga('set', 'checkProtocolTask', function () {
    });
    ga('set', 'appName', appName);
    ga('set', 'appId', appId);
    ga('set', 'appVersion', appVersion);
    ga('require', 'displayfeatures');
}
/**
 * Send a page
 *
 * @param url - page path
 */
export function page(url) {
    if (url) {
        if (!ChromeUtils.DEBUG) {
            ga('send', 'pageview', url);
        }
    }
}
/**
 * Send an event
 *
 * @param theEvent - the event type
 * @param label - override label
 * @param action - override action
 */
export function event(theEvent, label, action) {
    if (theEvent) {
        const ev = ChromeJSON.shallowCopy(theEvent);
        ev.hitType = 'event';
        ev.eventLabel = label ? label : ev.eventLabel;
        ev.eventAction = action ? action : ev.eventAction;
        if (!ChromeUtils.DEBUG) {
            ga('send', ev);
        }
        else {
            console.log(ev); // tslint:disable-line no-console
        }
    }
}
/**
 * Send an error
 *
 * @param label - override label
 * @param method - override method
 */
export function error(label = 'unknown', method = 'unknownMethod') {
    const ev = {
        hitType: 'event',
        eventCategory: 'error',
        eventAction: method,
        eventLabel: `Err: ${label}`,
    };
    if (!ChromeUtils.DEBUG) {
        ga('send', ev);
    }
    else {
        console.error(ev); // tslint:disable-line no-console
    }
}
/**
 * Send an exception
 *
 * @param err - the error
 * @param msg - the error message
 * @param fatal - true if fatal
 */
export function exception(err, msg, fatal) {
    try {
        const theFatal = (fatal === undefined) ? false : fatal;
        let theMsg = 'Unknown';
        if (msg) {
            theMsg = msg;
        }
        else if (err && err.message) {
            theMsg = err.message;
        }
        if (err && err.stack) {
            theMsg += `\n\n${err.stack}`;
        }
        const ex = {
            hitType: 'exception',
            exDescription: theMsg,
            exFatal: theFatal,
        };
        if (!ChromeUtils.DEBUG) {
            ga('send', ex);
        }
        else {
            console.error(ex); // tslint:disable-line no-console
        }
    }
    catch (err) {
        if (ChromeUtils.DEBUG) {
            console.error(err); // tslint:disable-line no-console
        }
    }
}
