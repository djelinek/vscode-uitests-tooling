/// <reference types="node" />
import * as childProcess from "child_process";
import { AsyncProcess } from "./AsyncProcess";
declare class AsyncCommandProcess extends AsyncProcess {
    private command;
    private args;
    private options?;
    constructor(command: string, args: string[], options?: childProcess.SpawnOptions | undefined);
    protected processSpawner(): childProcess.ChildProcess;
}
export { AsyncCommandProcess };
