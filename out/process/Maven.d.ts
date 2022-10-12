/// <reference types="node" />
import { SpawnOptions } from "child_process";
import { AsyncCommandProcess } from "./AsyncCommandProcess";
/**
 * Extends options of spawn process with maven options
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
interface MavenOptions extends SpawnOptions {
    /**
     * Maven properties to be overridden when calling maven.
     */
    properties?: {
        [key: string]: string;
    };
    /**
     * Args to be passed when calling maven.
     */
    args?: Array<string>;
}
/**
 * Creates new AsyncProcess which can be started later.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare class Maven extends AsyncCommandProcess {
    constructor(options: MavenOptions);
}
export { Maven };
