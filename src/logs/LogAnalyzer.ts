import * as readline from "readline";

/**
 * Type of function which is called when rule is matched in LogAnalyzer
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
type WhenCallback = (regexResult: RegExpExecArray) => void;


type Data = { [key: string]: string };

/**
 * Structure to hold regex and its actions. It is referred as "rule" in LogAnalyzer
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
interface RegexAction {
	regex: RegExp;
	action: WhenCallback;
}

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
	 * List of actions to be evaluated in process of parsing
	 */
	private _regexActions: Array<RegexAction> = [];

	/**
	 * Number of successful matches
	 */
	private _successfulMatches: number = 0;

	/**
	 * Captured data from parsing logs with regexes which utilizes named groups
	 */
	private _data: Data = {};

	/**
	 * Promise used to signalize waiting 
	 */
	private _waitPromise: Promise<Object> | null = null;

	private _done: boolean = false;

	/**
	 * 
	 * @param _logReader readline interface to be used to read logs
	 */
	public constructor(private _logReader: readline.Interface) {
		// Bind methods, so we can pass them directly to node functions without loosing current context
		this.analyzerWithOrder = this.analyzerWithOrder.bind(this);
		this.analyzerWithoutOrder = this.analyzerWithoutOrder.bind(this);
		this.captureData = this.captureData.bind(this);
	}


	/**
	 * Get number of successful matches
	 */
	public get successfulMatches(): number {
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
	public get capturedData(): Object {
		// Returns copy of data
		return { ...this._data };
	}

	private handleRegexExec(regexAction: RegexAction, line: string): boolean {
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

	private analyzerWithOrder(line: string): void {
		const currentRegexAction = this._regexActions[this._successfulMatches]; // Do not use this.successfulMatches
		this.handleRegexExec(currentRegexAction, line);
	}

	private analyzerWithoutOrder(line: string): void {
		for (const regexAction of this._regexActions) {
			if (this.handleRegexExec(regexAction, line)) {
				break;
			}
		}
	}

	private captureData(regexResult: RegExpExecArray): void {
		if (regexResult.groups === undefined) {
			return;
		}

		const groups = regexResult.groups as { [key: string]: string };

		for (const key of Object.keys(groups)) {
			this._data[key] = groups[key];
		}
	}

	private startParsing(parserFunction: (line: string) => void): void {
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
	public startOrderedParsing(): void {
		this.startParsing(this.analyzerWithOrder);
	}

	/**
	 * Parses logs and evaluates action rules passed to when* functions.
	 * Parser workflow:
	 * 1. Tries all rules until one matches. If we did not match and went out of rules, we skip line. 
	 * If rule matched, we execute rule action and move on next line.
	 */
	public startUnorderedParsing(): void {
		this.startParsing(this.analyzerWithoutOrder);
	}

	/**
	 * Stops parsing.
	 */
	public stop(): void {
		if (this._waitPromise === null) {
			throw new Error("Parser is not running");
		}
		this._logReader.removeAllListeners("line");
		this._logReader.close();
	}

	/**
	 * Wait until parser finishes. Do not forget to use await.
	 */
	public async wait(): Promise<Object> {
		if (this._waitPromise === null) {
			throw new Error("Parser is not parsing");
		}

		return this._waitPromise;
	}

	/**
	 * Adds new rule.
	 * @param regex regex, rule to determine when action should be executed
	 * @param action action to be executed
	 */
	public whenMatches(regex: RegExp, action: WhenCallback): LogAnalyzer {
		this._regexActions.push({ regex, action });
		return this;
	}

	/**
	 * Adds new rule which extracts data from line when regex matches. Use named regex groups to extract data.
	 * @param regex regex, rule to determine when data from line should be extracted with named groups (regex feature)
	 */
	public whenMatchesThenCaptureData(regex: RegExp): LogAnalyzer {
		this._regexActions.push({ regex, action: this.captureData });
		return this;
	}
}

export { LogAnalyzer };
export default LogAnalyzer;
