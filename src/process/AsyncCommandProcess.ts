import * as childProcess from "child_process";
import { AsyncProcess } from "./AsyncProcess";

class AsyncCommandProcess extends AsyncProcess {
	
	public constructor(private command: string, private args: string[], private options?: childProcess.SpawnOptions) {
		super();
	}

	protected processSpawner(): childProcess.ChildProcess {
		return childProcess.spawn(this.command, this.args, this.options || {});
	}
}

export { AsyncCommandProcess };
