import { error } from "vscode-extension-tester";

// eslint-disable-next-line @typescript-eslint/ban-types
export type ErrorType = Function;

/**
 * List of errors that are usually responsible for WebElement interactivity flakiness. 
 */
export const INTERACTIVITY_ERRORS: ErrorType[] = [error.StaleElementReferenceError, error.NoSuchElementError, error.ElementNotInteractableError];

/**
 * Check whether thrown error is in the list.
 * @param e thrown error
 * @param errors errors to be checked
 * @returns true if e is in error list, otherwise false
 */
export function is(e: any, ...errors: ErrorType[]): boolean {
	return errors.find((err) => e instanceof err) !== undefined;
}
