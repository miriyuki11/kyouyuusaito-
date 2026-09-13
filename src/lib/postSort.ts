import type { Post, PostSortKey, SortDirection } from "@/types/posts";

export function sortPosts(posts: Post[], sortKey: PostSortKey, direction: SortDirection, ratings: Record<number, number>): Post[] {
	if (sortKey === "newest") {
		return [...posts].sort((firstPost, secondPost) => {
			const firstTime = firstPost.createdAt ? new Date(firstPost.createdAt).getTime() : firstPost.id;
			const secondTime = secondPost.createdAt ? new Date(secondPost.createdAt).getTime() : secondPost.id;
			return (firstTime - secondTime) * (direction === "asc" ? 1 : -1);
		});
	}

	return [...posts].sort((firstPost, secondPost) => {
		const firstValue = sortKey === "likes" ? firstPost.likes : ratings[firstPost.id] || 0;
		const secondValue = sortKey === "likes" ? secondPost.likes : ratings[secondPost.id] || 0;
		return (firstValue - secondValue) * (direction === "asc" ? 1 : -1);
	});
}