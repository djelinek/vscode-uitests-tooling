import { Workbench } from 'vscode-extension-tester';

/**
 * @author jkopriva
 */
class NotificationCenter {

	public async clearNotifications() {
		try {
			const center = await new Workbench().openNotificationsCenter();
			return await center.clearAllNotifications();
		} catch (err) {
			console.log(err);
			return null;
		}
	}
}

export { NotificationCenter };
