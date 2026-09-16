import { getStoredJson, setStoredJson } from "@/lib/storage";

export const bookmarkedPostsStorageKey = "pick-bookmarked-posts";

export function getBookmarkedPostIds() {
	return getStoredJson<number[]>(bookmarkedPostsStorageKey, []);
}

export function toggleBookmarkedPost(postId: number) {
	const bookmarkedPostIds = getBookmarkedPostIds();
	const nextBookmarkedPostIds = bookmarkedPostIds.includes(postId)
		? bookmarkedPostIds.filter((savedPostId) => savedPostId !== postId)
		: [...bookmarkedPostIds, postId];
	setStoredJson(bookmarkedPostsStorageKey, nextBookmarkedPostIds);
	return nextBookmarkedPostIds.includes(postId);
}