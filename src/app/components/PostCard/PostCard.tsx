"use client";

import FollowButton from "@/app/components/FollowButton/FollowButton";
import RatingStars from "@/app/components/RatingStars/RatingStars";
import Link from "next/link";
import type { Post } from "@/lib/posts";

type PostCardProps = { post: Post; index?: number; isOwn?: boolean; rating?: number; onRate?: (rating: number) => void };

export default function PostCard({ post, index = 0, isOwn = false, rating = 0, onRate }: PostCardProps) {
	return <article className={`post-card post-card-${index % 3}`}>
		<Link className="post-image-wrap post-image-link" href={`/posts/${post.id}`} aria-label={`${post.title || "お気に入りの購入品"}の詳細を見る`}>
			<img className="post-image" src={post.image} alt={`${post.name}さんの購入品`} />
			<span className="post-category">{post.category}</span>
		</Link>
		{isOwn && onRate && <RatingStars rating={rating} onChange={onRate} />}
		<div className="post-body">
			<h3 className="post-title"><Link href={`/posts/${post.id}`}>{post.title || "お気に入りの購入品"}</Link></h3>
			<div className="post-meta"><span className="avatar">{post.avatar}</span><Link className="user-link" href={`/users/${encodeURIComponent(post.name)}`}>{post.name}</Link>{!isOwn && <FollowButton userName={post.name} />}<span className="post-date">{formatPostDate(post)}</span></div>
			<p className="post-description">{post.description}</p>
			{post.placeUrl && <div className="post-links"><a className="place-link" href={post.placeUrl} target="_blank" rel="noreferrer">購入場所を見る ↗</a></div>}
		</div>
	</article>;
}

function formatPostDate(post: Post) {
	if (!post.createdAt) return post.date;
	const createdAt = new Date(post.createdAt);
	return Number.isNaN(createdAt.getTime()) ? post.date : createdAt.toLocaleString("ja-JP");
}