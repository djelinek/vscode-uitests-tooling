import { AsyncFunc, Func } from 'mocha';
export declare function before(name: string, fn?: Func | AsyncFunc): void;
export declare function after(name: string, fn?: Func | AsyncFunc): void;
