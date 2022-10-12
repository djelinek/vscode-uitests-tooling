"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWait = void 0;
/**
 * Predefined waiting time constants
 */
var TimePeriod;
(function (TimePeriod) {
    TimePeriod[TimePeriod["DEFAULT"] = 5000] = "DEFAULT";
    TimePeriod[TimePeriod["SHORT"] = 1500] = "SHORT";
    TimePeriod[TimePeriod["MEDIUM"] = 3000] = "MEDIUM";
    TimePeriod[TimePeriod["LONG"] = 15000] = "LONG";
    TimePeriod[TimePeriod["VERY_LONG"] = 30000] = "VERY_LONG";
})(TimePeriod || (TimePeriod = {}));
/**
 * Class containing all basic wait conditions
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class DefaultWait {
    /**
    * Suspends thread if used with await keyword. When promise is used instead, it has similar
    * effect as setTimeout function.
    *
    * @param ms sleep time
    */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.DefaultWait = DefaultWait;
DefaultWait.TimePeriod = TimePeriod;
//# sourceMappingURL=DefaultWait.js.map