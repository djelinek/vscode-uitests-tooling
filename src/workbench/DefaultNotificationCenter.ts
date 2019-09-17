import { Workbench } from 'vscode-extension-tester';

/**
 * @author jkopriva
 */
export class DefaultNotificationCenter {

    async clearNotifications() {
        try {
            const center = await new Workbench().openNotificationsCenter();
            await center.clearAllNotifications();
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
