/// <reference types="node" />
import * as readline from "readline";
/**
 * Type of function which is called when rule is matched in LogAnalyzer
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare type WhenCallback = (regexResult: RegExpExecArray) => void;
/**
 * Utility class to help parse logs from text read from readline interface.
 * This class triggers actions when regex matches current line. Actions can be
 * registered with functions LogAnalyzer#whenMatches and LogAnalyzer#whenMatchesThenCaptureData.
 *
 * Please note, only texts which ends with End of Line (EOL) are supported.
 *
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare class LogAnalyzer {
    private _logReader;
    /**
     * List of actions to be evaluated in process of parsing
     */
    private _regexActions;
    /**
     * Number of successful matches
     */
    private _successfulMatches;
    /**
     * Captured data from parsing logs with regexes which utilizes named groups
     */
    private _data;
    /**
     * Promise used to signalize waiting
     */
    private _waitPromise;
    private _done;
    /**
     * @param _logReader readline interface to be used to read logs
     */
    constructor(_logReader: readline.Interface);
    /**
     * Get number of successful matches
     */
    get successfulMatches(): number;
    /**
     * Get captured data from regex named groups
     */
    get capturedData(): Object;
    private handleRegexExec;
    private analyzerWithOrder;
    private analyzerWithoutOrder;
    private captureData;
    private startParsing;
    /**
     * Parses logs and evaluates action rules passed to when* functions in order.
     * Parser workflow:
     * 1. If line matches rule, execute action and prepare another rule to be matched. Otherwise skip to another line and try again.
     * 2. Repeat step 1 until we are out of rules to match
     */
    startOrderedParsing(): void;
    /**
     * Parses logs and evaluates action rules passed to when* functions.
     * Parser workflow:
     * 1. Tries all rules until one matches. If we did not match and went out of rules, we skip line.
     * If rule matched, we execute rule action and move on next line.
     */
    startUnorderedParsing(): void;
    /**
     * Stops parsing.
     */
    stop(): void;
    /**
     * Wait until parser finishes. Do not forget to use await.
     */
    wait(): Promise<Object>;
    /**
     * Adds new rule.
     * @param regex regex, rule to determine when action should be executed
     * @param action action to be executed
     */
    whenMatches(regex: RegExp, action: WhenCallback): LogAnalyzer;
    /**
     * Adds new rule which extracts data from line when regex matches. Use named regex groups to extract data.
     * @param regex regex, rule to determine when data from line should be extracted with named groups (regex feature)
     */
    whenMatchesThenCaptureData(regex: RegExp): LogAnalyzer;
}
export { LogAnalyzer };
