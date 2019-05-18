/**
 * Google Oauth2.0 utilities
 * {@link https://developer.chrome.com/apps/identity}
 *
 * @module chrome/auth
 */

/** */

/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */

import * as ChromeUtils from './utils';

declare var ChromePromise: any;
const chromep = new ChromePromise();

/**
 * Get an OAuth2.0 token
 *
 * @remarks
 *
 * Note: Every time you use a different scopes array, you will get a new
 * token the first time, so you need to always get it with those scopes
 * and remove the cached one with the scopes.
 *
 * @param interactive - if true may block
 * @param scopes - optional scopes to use, overrides those in the manifest
 * @throws An error if we failed to get token
 * @returns An access token
 */
export async function getToken(interactive = false, scopes?: string[]) {
  const request: chrome.identity.TokenDetails = {
    interactive: interactive,
  };
  if (scopes && scopes.length) {
    request.scopes = scopes;
  }
  return await chromep.identity.getAuthToken(request);
}

/**
 * Remove a cached OAuth2.0 token
 *
 * @param interactive - if true may block
 * @param curToken token to remove
 * @param scopes - optional scopes to use, overrides those in the manifest
 * @throws An error if we failed to remove token
 * @returns The old token
 */
export async function removeCachedToken(interactive = false, curToken: string | null = '', scopes?: string[]) {
  let oldToken = curToken;

  if (ChromeUtils.isWhiteSpace(oldToken)) {
    oldToken = await getToken(interactive, scopes);
  }

  if (oldToken) {
    await chromep.identity.removeCachedAuthToken({token: oldToken});
  }

  return oldToken;
}

/**
 * Is a user signed in to Chrome
 *
 * @returns true if signed in
 */
export async function isSignedIn() {
  let ret = true;

  // try to get a token and check failure message
  try {
    await chromep.identity.getAuthToken({interactive: false});
  } catch (err) {
    if (err.message.match(/not signed in/)) {
      ret = false;
    }
  }

  return ret;
}

/**
 * Has our authorization been revoked (or not granted) for the default scopes
 *
 * @returns true if no valid token
 */
export async function isRevoked() {
  let ret = false;

  // try to get a token and check failure message
  try {
    await chromep.identity.getAuthToken({interactive: false});
  } catch (err) {
    if (err.message.match(/OAuth2 not granted or revoked/)) {
      ret = true;
    }
  }

  return ret;
}
