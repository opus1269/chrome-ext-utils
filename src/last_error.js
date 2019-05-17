/**
 * Custom error
 *
 * @module chrome/last_error
 */
const chromep = new ChromePromise();
/**
 * A custom error that can be persisted
 *
 * @remarks
 *
 * Usage:
 * ```ts
 * const err = new ChromeLastError(title, message);
 * ```
 */
export class ChromeLastError extends Error {
    /**
     * Get the LastError from chrome.storage.local
     *
     * @throws If we failed to get the error
     * @returns A ChromeLastError
     */
    static async load() {
        const value = await chromep.storage.local.get('lastError');
        const details = value.lastError;
        if (details) {
            const lastError = new ChromeLastError(details.title, details.message);
            lastError.stack = details.stack;
            return lastError;
        }
        return new ChromeLastError();
    }
    /**
     * Save the LastError to chrome.storage.local
     *
     * @throws If the error failed to save
     */
    static async save(lastError) {
        const value = {
            title: lastError.title || '',
            message: lastError.message || '',
            stack: lastError.stack || '',
        };
        // persist
        return await chromep.storage.local.set({ lastError: value });
    }
    /**
     * Set the LastError to an empty message in chrome.storage.local
     *
     * @throws If the error failed to clear
     */
    static async reset() {
        // Save it using the Chrome storage API.
        return await chromep.storage.local.set({ lastError: new ChromeLastError() });
    }
    /**
     * Create a new LastError
     *
     * @param title='' - optional title
     * @param params - Error parameters
     */
    constructor(title = 'An error occurred', ...params) {
        // Pass remaining arguments (including vendor specific ones)
        // to parent constructor
        super(...params);
        // Maintains proper stack trace for where our error was thrown
        // (only available on V8)
        // @ts-ignore
        if (Error.captureStackTrace) {
            // @ts-ignore
            Error.captureStackTrace(this, ChromeLastError);
        }
        // Custom information
        this.title = title;
    }
}
