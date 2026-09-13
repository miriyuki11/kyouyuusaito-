"use client";

import PostCard from "@/app/components/PostCard/PostCard";
import type { Post } from "@/lib/posts";

type MyPostListProps = { posts: Post[]; ratings: Record<number, number>; onRate: (id: number, rating: number) => void };

export default function MyPostList({ posts, ratings, onRate }: MyPostListProps) {
	return <div className="post-grid my-post-grid">{posts.map((post, index) => <PostCard key={post.id} post={post} index={index} isOwn rating={ratings[post.id] || 0} onRate={(rating) => onRate(post.id, rating)} />)}</div>;
}