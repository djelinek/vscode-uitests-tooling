type Executor<T> = (resolve: (value?: T | PromiseLike<T> | undefined) => void, reject: (reason?: any) => void) => void;

class TimeoutPromise<T> extends Promise<T> {

	public constructor(executor: Executor<T>, timeout?: number) {
		super(TimeoutPromise.create(executor, timeout));
	}

	private static create<T>(executor: Executor<T>, timeout?: number): Executor<T> {
		return async (resolve: (value?: T | PromiseLike<T> | undefined) => void,
			reject: (reason?: any) => void) => {

			let timer: NodeJS.Timeout | null = null;

			if (timeout !== undefined) {
				timer = setTimeout(() => reject("Timeout error"), timeout);
			}

			try {
				executor(resolve, reject);
			}
			catch (e) {
				reject(e);
			}

			if (timeout !== undefined) {
				clearTimeout(timer as NodeJS.Timeout);
			}
		};
	}
}

export { TimeoutPromise };
