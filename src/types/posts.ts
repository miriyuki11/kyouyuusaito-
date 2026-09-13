export type Post = {
	id: number;
	title?: string;
	name: string;
	category: string;
	description: string;
	placeUrl?: string;
	label?: string;
	labels?: string[];
	image: string;
	avatar: string;
	date: string;
	likes: number;
	createdAt?: string;
};

export type PostSortKey = "newest" | "likes" | "rating";
export type SortDirection = "asc" | "desc";