/// <reference types="node" />
import * as childProcess from "child_process";
import { AsyncProcess } from "./AsyncProcess";
declare class AsyncNodeProcess extends AsyncProcess {
    private module;
    private args;
    private options?;
    constructor(module: string, args: string[], options?: childProcess.SpawnOptions | undefined);
    protected processSpawner(): childProcess.ChildProcess;
}
export { AsyncNodeProcess };
