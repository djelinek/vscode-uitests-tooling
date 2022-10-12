"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAnalyzer = void 0;
/**
 * Utility class to help parse logs from text read from readline interface.
 * This class triggers actions when regex matches current line. Actions can be
 * registered with functions LogAnalyzer#whenMatches and LogAnalyzer#whenMatchesThenCaptureData.
 *
 * Please note, only texts which ends with End of Line (EOL) are supported.
 *
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class LogAnalyzer {
    /**
     * @param _logReader readline interface to be used to read logs
     */
    constructor(_logReader) {
        this._logReader = _logReader;
        /**
         * List of actions to be evaluated in process of parsing
         */
        this._regexActions = [];
        /**
         * Number of successful matches
         */
        this._successfulMatches = 0;
        /**
         * Captured data from parsing logs with regexes which utilizes named groups
         */
        this._data = {};
        /**
         * Promise used to signalize waiting
         */
        this._waitPromise = null;
        this._done = false;
        // Bind methods, so we can pass them directly to node functions without loosing current context
        this.analyzerWithOrder = this.analyzerWithOrder.bind(this);
        this.analyzerWithoutOrder = this.analyzerWithoutOrder.bind(this);
        this.captureData = this.captureData.bind(this);
    }
    /**
     * Get number of successful matches
     */
    get successfulMatches() {
        if (!this._done && this._waitPromise === null) {
            throw new Error("Parser did not start");
        }
        if (!this._done && this._waitPromise !== null) {
            throw new Error("Parser is parsing at this moment");
        }
        return this._successfulMatches;
    }
    /**
     * Get captured data from regex named groups
     */
    get capturedData() {
        // Returns copy of data
        return Object.assign({}, this._data);
    }
    handleRegexExec(regexAction, line) {
        const result = regexAction.regex.exec(line);
        if (result !== null) {
            regexAction.action(result);
            this._successfulMatches++;
            if (this._successfulMatches === this._regexActions.length) {
                this.stop();
            }
            return true;
        }
        return false;
    }
    analyzerWithOrder(line) {
        const currentRegexAction = this._regexActions[this._successfulMatches]; // Do not use this.successfulMatches
        this.handleRegexExec(currentRegexAction, line);
    }
    analyzerWithoutOrder(line) {
        for (const regexAction of this._regexActions) {
            if (this.handleRegexExec(regexAction, line)) {
                break;
            }
        }
    }
    captureData(regexResult) {
        if (regexResult.groups === undefined) {
            return;
        }
        const groups = regexResult.groups;
        for (const key of Object.keys(groups)) {
            this._data[key] = groups[key];
        }
    }
    startParsing(parserFunction) {
        if (this._done) {
            throw new Error("Analyzer cannot be started again. Create new object instead");
        }
        this._logReader.on("line", parserFunction);
        // Wait condition, wait for end of stream
        this._waitPromise = new Promise(resolve => this._logReader.on("close", () => {
            this._done = true;
            resolve(this.capturedData);
        }));
    }
    /**
     * Parses logs and evaluates action rules passed to when* functions in order.
     * Parser workflow:
     * 1. If line matches rule, execute action and prepare another rule to be matched. Otherwise skip to another line and try again.
     * 2. Repeat step 1 until we are out of rules to match
     */
    startOrderedParsing() {
        this.startParsing(this.analyzerWithOrder);
    }
    /**
     * Parses logs and evaluates action rules passed to when* functions.
     * Parser workflow:
     * 1. Tries all rules until one matches. If we did not match and went out of rules, we skip line.
     * If rule matched, we execute rule action and move on next line.
     */
    startUnorderedParsing() {
        this.startParsing(this.analyzerWithoutOrder);
    }
    /**
     * Stops parsing.
     */
    stop() {
        if (this._waitPromise === null) {
            throw new Error("Parser is not running");
        }
        this._logReader.removeAllListeners("line");
        this._logReader.close();
    }
    /**
     * Wait until parser finishes. Do not forget to use await.
     */
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._waitPromise === null) {
                throw new Error("Parser is not parsing");
            }
            return this._waitPromise;
        });
    }
    /**
     * Adds new rule.
     * @param regex regex, rule to determine when action should be executed
     * @param action action to be executed
     */
    whenMatches(regex, action) {
        this._regexActions.push({ regex, action });
        return this;
    }
    /**
     * Adds new rule which extracts data from line when regex matches. Use named regex groups to extract data.
     * @param regex regex, rule to determine when data from line should be extracted with named groups (regex feature)
     */
    whenMatchesThenCaptureData(regex) {
        this._regexActions.push({ regex, action: this.captureData });
        return this;
    }
}
exports.LogAnalyzer = LogAnalyzer;
//# sourceMappingURL=LogAnalyzer.js.map