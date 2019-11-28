import { Workbench } from 'vscode-extension-tester';

/**
 * @author jkopriva
 */
class NotificationCenterExt {

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

export { NotificationCenterExt };
export default { NotificationCenterExt };
