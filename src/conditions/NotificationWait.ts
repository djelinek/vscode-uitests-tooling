import { Workbench, NotificationType } from 'vscode-extension-tester';

/**
 * @author jkopriva
 */
export class NotificationWait {
    
    async getNotificationWithMessage(message: string) {
        try {
            const center = await new Workbench().openNotificationsCenter();
            const notifications = await center.getNotifications(NotificationType.Any);
            for (const item of notifications) {
                const text = await item.getMessage();
                if (text.indexOf(message) > -1) {
                    return item;
                }
            }
            return null;
        } catch (err) {
            // do not print err
            return null;
        }
    }
    
    async whileGetNotificationWithMessage(message: string) {
        return !(await this.getNotificationWithMessage(message));
    }
}