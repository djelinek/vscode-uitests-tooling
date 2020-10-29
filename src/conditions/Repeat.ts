import { Rejecter, Resolver, TimeoutPromise } from "../promise/TimeoutPromise";

export interface RepeatArguments {
	/**
	 * Repeat function <count> times. If undefined function will be repeated infinitely or until time outs.
	 */
	count?: number;
	/**
	 * Repeat timeout after promise is rejected. If undefined function will be repeated <count> times or infinitely.
	 */
	timeout?: number;
}
/**
 * Repeat function until it returns truthy value.
 * 
 * @param func function to repeat
 * @param options repeat options
 */
export async function repeat<T>(func: (() => T | PromiseLike<T>), options?: RepeatArguments): Promise<T> {
	const { count, timeout } = options || { count: undefined, timeout: undefined };
	let run = true;

	if (count !== undefined && count <= 0) {
		throw new Error("Count must be larger than 0");
	}

	async function closure(cnt: number | undefined, resolve: Resolver<T>, reject: Rejecter) {
		if (cnt !== undefined && cnt === 0) {
			reject(new Error(`Cannot repeat function more than ${count} times.`));
			return;
		}
		try {
			const value = await func();
			if (value) {
				resolve(value);
				return;
			}
			throw new Error("Value does not have truthy value");
		}
		catch (e) {
			if (run) {
				setImmediate(closure, cnt !== undefined ? cnt - 1 : undefined, resolve, reject);
			}
		}
	}
	return new TimeoutPromise<T>((resolve, reject) => {
		setImmediate(closure, count, resolve, reject);
	}, timeout, () => run = false);
}
