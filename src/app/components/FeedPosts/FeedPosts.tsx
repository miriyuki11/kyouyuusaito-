"use client";

import PostCard from "@/app/components/PostCard/PostCard";
import type { Post } from "@/lib/posts";

type FeedPostsProps = { posts: Post[]; userPostIds: number[]; ratings: Record<number, number>; onRate: (id: number, rating: number) => void };

export default function FeedPosts({ posts, userPostIds, ratings, onRate }: FeedPostsProps) {
	return <div className="post-grid">{posts.map((post, index) => <PostCard key={post.id} post={post} index={index} isOwn={userPostIds.includes(post.id)} rating={ratings[post.id] || 0} onRate={(rating) => onRate(post.id, rating)} />)}</div>;
}