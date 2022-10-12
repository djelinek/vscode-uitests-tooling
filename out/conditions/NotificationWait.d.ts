/**
 * @author jkopriva
 */
declare class NotificationWait {
    getNotificationWithMessage(message: string): Promise<import("vscode-extension-tester").Notification | null>;
    whileGetNotificationWithMessage(message: string): Promise<boolean>;
}
export { NotificationWait };
