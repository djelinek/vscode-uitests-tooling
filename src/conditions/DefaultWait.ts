/**
 * Predefined waiting time constants
 */
enum TimePeriod {
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
class DefaultWait {

	public static readonly TimePeriod = TimePeriod;

	/**
	  * Suspends thread if used with await keyword. When promise is used instead, it has similar
	  * effect as setTimeout function.
	  * 
	  * @param ms sleep time
	  */
	public static sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

export { DefaultWait };
