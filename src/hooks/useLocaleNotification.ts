import * as Notifications from "expo-notifications";
import { requestPermissionsAsync } from "expo-notifications";

export async function sendLocalNotification(title?: string, body?: string) {
    const granted = await requestPermissionsAsync();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: title || 'Notificação Local',
            body: body || 'Esta é uma notificação local.',
            data: { foo: 'bar' },
        },
        trigger: null,
    });
}