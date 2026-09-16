import { getStoredJson, setStoredJson } from "@/lib/storage";

export type PostNotification = {
	id: number;
	postId: number;
	createdAt: string;
	actorName: string;
};

const likedNotificationsStorageKey = "pick-liked-notifications";
const commentNotificationsStorageKey = "pick-comment-notifications";

function getNotifications(key: string) {
	return getStoredJson<PostNotification[]>(key, []);
}

function saveNotifications(key: string, notifications: PostNotification[]) {
	setStoredJson(key, notifications);
}

export function getLikedNotifications() {
	return getNotifications(likedNotificationsStorageKey);
}

export function getCommentNotifications() {
	return getNotifications(commentNotificationsStorageKey);
}

export function addLikedNotification(postId: number, actorName = "あなた") {
	const notifications = getLikedNotifications();
	if (notifications.some((notification) => notification.postId === postId && notification.actorName === actorName)) return;

	saveNotifications(likedNotificationsStorageKey, [
		...notifications,
		{ id: Date.now(), postId, createdAt: new Date().toISOString(), actorName },
	]);
}

export function removeLikedNotification(postId: number, actorName = "あなた") {
	saveNotifications(
		likedNotificationsStorageKey,
		getLikedNotifications().filter((notification) => !(notification.postId === postId && notification.actorName === actorName)),
	);
}

export function addCommentNotification(postId: number, actorName = "あなた") {
	const notifications = getCommentNotifications();
	saveNotifications(commentNotificationsStorageKey, [
		...notifications,
		{ id: Date.now(), postId, createdAt: new Date().toISOString(), actorName },
	]);
}