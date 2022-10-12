export declare namespace notifications {
    const ATLASMAP_STARTING = "Starting AtlasMap instance at port ";
    const ATLASMAP_RUNNING = "Running AtlasMap instance found";
    const ATLASMAP_WAITING = "Waiting for ";
    const ATLASMAP_STOPPING = "Stopping AtlasMap instance at port";
    const ATLASMAP_STOPPED = "Stopped AtlasMap instance at port";
    const ATLASMAP_UNABLE_LOCATE = "Unable to locate running AtlasMap instance";
}
export declare namespace commands {
    const START_ATLASMAP = "AtlasMap: Open AtlasMap";
    const STOP_ATLASMAP = "AtlasMap: Stop AtlasMap";
}
export declare namespace views {
    const ATLASMAP_TITLE = "AtlasMap";
}
/**
 * Contains all specific methods, constants, etc. for extension - AtlasMap
 * @author jkopriva
 */
declare class AtlasMapExt {
    start(): Promise<void>;
    stop(): Promise<void>;
    tabIsAccessible(): Promise<void>;
    windowExists(): Promise<boolean | undefined>;
}
export { AtlasMapExt };
