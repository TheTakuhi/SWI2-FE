import { NotificationManager } from "react-notifications";

export const createNotification = (type, message, callback) => {
    let { chatroomTitle: title, authorUsername: username } = message;
    let content = message.message;

    username = username[0].toUpperCase() + username.slice(1);

    if (!title) {
        title = username;
    } else {
        if (content.length > 40) content = `${content.substring(0, 40)}...`;

        content = `${username}: ${content}`;
    }

    switch (type) {
        case 'success':
            return NotificationManager.success(content, title, 3000, () => callback && callback());
        case 'warning':
            return NotificationManager.warning(content, title, 3000, () => callback && callback());
        case 'error':
            return NotificationManager.error(content, title, 3000, () => callback && callback());
        case 'info':
            return NotificationManager.info(content, title, 3000, () => callback && callback());
        default:
            return NotificationManager.info(content, title, 3000, () => callback && callback());
    }
}