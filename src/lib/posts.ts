import { getStoredJson, setStoredJson } from "@/lib/storage";
import type { Post } from "@/types/posts";

export type { Post } from "@/types/posts";

export const userPostsStorageKey = "pick-user-posts";
export const userLabelsStorageKey = "pick-user-labels";
export const userCategoriesStorageKey = "pick-user-categories";
export const postRatingsStorageKey = "pick-post-ratings";

export const defaultLabels = ["お気に入り", "毎日使う", "旅の相棒", "プレゼント", "リピート"];
export const defaultCategories = ["暮らし", "ファッション", "本・音楽", "ガジェット", "美容", "食べ物"];

export function getUserPosts(): Post[] {
	return getStoredJson<Post[]>(userPostsStorageKey, []);
}

export function saveUserPosts(posts: Post[]) {
	setStoredJson(userPostsStorageKey, posts);
}

export function getUserLabels(): string[] {
	return Array.from(new Set([...defaultLabels, ...getStoredJson<string[]>(userLabelsStorageKey, [])]));
}

export function saveUserLabels(labels: string[]) {
	setStoredJson(userLabelsStorageKey, Array.from(new Set(labels)));
}

export function getUserCategories(): string[] {
	return Array.from(new Set([...defaultCategories, ...getStoredJson<string[]>(userCategoriesStorageKey, [])]));
}

export function saveUserCategories(categories: string[]) {
	setStoredJson(userCategoriesStorageKey, Array.from(new Set(categories)));
}

export function getPostRatings(): Record<number, number> {
	return getStoredJson<Record<number, number>>(postRatingsStorageKey, {});
}

export function savePostRatings(ratings: Record<number, number>) {
	setStoredJson(postRatingsStorageKey, ratings);
}