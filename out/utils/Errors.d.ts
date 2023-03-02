export declare type ErrorType = Function;
/**
 * List of errors that are usually responsible for WebElement interactivity flakyness.
 */
export declare const INTERACTIVITY_ERRORS: ErrorType[];
/**
 * Check whether thrown error is in the list.
 * @param e thrown error
 * @param errors errors to be checked
 * @returns true if e is in error list, otherwise false
 */
export declare function is(e: any, ...errors: ErrorType[]): boolean;
