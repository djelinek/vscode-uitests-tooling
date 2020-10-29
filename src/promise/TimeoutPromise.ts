export type Resolver<T> = (value?: T | PromiseLike<T> | undefined) => void;
export type Rejecter = (reason?: any) => void;
type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

class TimeoutPromise<T> extends Promise<T> {

	public constructor(executor: Executor<T>, timeout?: number, onTimeout?: () => void) {
		super(TimeoutPromise.create(executor, timeout, onTimeout));
	}

	private static decorateResolver<T>(resolver: Resolver<T> | Rejecter, timer: NodeJS.Timeout | null): Resolver<T> {
		return (value?: T | PromiseLike<T> | undefined) => {
			if (timer) {
				clearTimeout(timer);
			}
			resolver(value);
		};
	}

	private static create<T>(executor: Executor<T>, timeout?: number, onTimeout?: () => void): Executor<T> {
		return async (resolve: (value?: T | PromiseLike<T> | undefined) => void,
			reject: (reason?: any) => void) => {
	
			let timer: NodeJS.Timeout | null = null;
				
			if (timeout !== undefined) {
				const start = Date.now();
				timer = setTimeout(() => {
					reject(new Error(`Promise timed out after ${Date.now() - start}ms.`));
					if (onTimeout) {
						onTimeout();
					}
				}, timeout);
			}

			resolve = this.decorateResolver(resolve, timer);
			reject = this.decorateResolver(reject, timer);
				
			try {
				executor(resolve, reject);
			}
			catch (e) {
				reject(e);
			}
		};
	}
}

export { TimeoutPromise };
