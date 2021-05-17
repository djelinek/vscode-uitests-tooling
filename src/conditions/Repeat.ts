import { Rejecter, Resolver, TimeoutError, TimeoutPromise } from './TimeoutPromise';

export interface RepeatArguments {
	/**
	 * Repeat function <count> times. If undefined function will be repeated infinitely or until time outs.
	 */
	count?: number;
	/**
	 * Repeat timeout after promise is rejected. If undefined function will be repeated <count> times or infinitely.
	 */
	timeout?: number;

	/**
	 * Do not resolve repeat operation immediately. Wait until truthy value is returned consequently for <threshold> milliseconds.
	 */
	threshold?: number;

	/**
	 * Error message when repeat time outs.
	 */
	message?: string;

	log?: boolean;

	// Repeat identification. For log purposes.
	id?: string;
}

/**
 * Repeat function until it returns truthy value.
 * 
 * @param func function to repeat
 * @param options repeat options
 */
export async function repeat<T>(func: (() => T | PromiseLike<T>), options?: RepeatArguments): Promise<T> {
	let { count, timeout } = options || { count: undefined, timeout: undefined };
	let run = true;
	let start = 0;
	let plannedTask: NodeJS.Immediate | undefined = undefined;
	const id = options?.id || "anonymous";
	const threshold = options?.threshold || 0;
	
	const log = options?.log ? (message: string, loggerFunction: (message: string) => void = console.log) => {
		loggerFunction(`[${id}] ${message}`);
	} : () => { };

	if (count !== undefined && count <= 0) {
		throw new Error("Count must be larger than 0");
	}

	if (timeout === 0 && count === undefined) {
		count = 1;
		timeout = undefined;
	}

	async function closure(cnt: number | undefined, resolve: Resolver<T>, reject: Rejecter, callStack: string | undefined) {
		if (cnt !== undefined && cnt === 0) {
			plannedTask = undefined;
			reject(new TimeoutError(`[${id}] Cannot repeat function more than ${count} times.\n${callStack}`));
			return;
		}
		try {
			const value = await func();
			if (value && ((start !== 0 && Date.now() - start >= threshold) || (threshold === 0))) {
				plannedTask = undefined;
				resolve(value);
				log("Threshold reached");
			}
			else if (value) {
				if (start === 0) {
					start = Date.now();
				}
				log("Threshold not reached");
				plannedTask = setImmediate(closure, cnt, resolve, reject);
			}
			else {
				start = 0;
				if (run) {
					plannedTask = setImmediate(closure, cnt !== undefined ? cnt - 1 : undefined, resolve, reject);
				}
				else {
					plannedTask = undefined;
				}
			}
		}
		catch (e) {
			e.message += '\n' + callStack;
			plannedTask = undefined;
			reject(e);
		}
	}

	// get call stack
	let callStack: string | undefined = undefined;
	try {
		throw new Error();
	}
	catch (e) {
		callStack = (e as Error).stack;
		callStack = callStack?.split('\n\t').join('\t\n');
	}

	return new TimeoutPromise<T>((resolve, reject) => {
		plannedTask = setImmediate(closure, count, resolve, reject, callStack);
	}, timeout, {
		onTimeout: () => {
			run = false;
			if (plannedTask) {
				clearImmediate(plannedTask);
				plannedTask = undefined;
			}
		},
		id: options?.id,
		message: options?.message,
		callStack
	});
}
