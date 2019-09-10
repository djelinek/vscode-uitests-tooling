/**
 * Class containing all basic wait conditions
 * 
 * @author djelinek
 */
export class DefaultWait {

	/**
 	* Suspends thread if used with await keyword. When promise is used instead, it has similar
 	* effect as setTimeout function.
 	* 
 	* @param ms sleep time
 	*/
	sleep(ms: number): Promise<NodeJS.Timeout> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
