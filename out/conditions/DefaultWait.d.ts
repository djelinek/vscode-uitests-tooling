/// <reference types="node" />
/**
 * Predefined waiting time constants
 */
declare enum TimePeriod {
    DEFAULT = 5000,
    SHORT = 1500,
    MEDIUM = 3000,
    LONG = 15000,
    VERY_LONG = 30000
}
/**
 * Class containing all basic wait conditions
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
declare class DefaultWait {
    static readonly TimePeriod: typeof TimePeriod;
    /**
    * Suspends thread if used with await keyword. When promise is used instead, it has similar
    * effect as setTimeout function.
    *
    * @param ms sleep time
    */
    static sleep(ms: number): Promise<NodeJS.Timeout>;
}
export { DefaultWait };
