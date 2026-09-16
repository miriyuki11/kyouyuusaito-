"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CommentSection from "@/app/components/CommentSection/CommentSection";
import BookmarkButton from "@/app/components/BookmarkButton/BookmarkButton";
import Header from "@/app/components/Header/Header";
import FollowButton from "@/app/components/FollowButton/FollowButton";
import LikeButton from "@/app/components/LikeButton/LikeButton";
import { getUserPosts } from "@/lib/posts";
import { addLikedNotification, removeLikedNotification } from "@/lib/notifications";
import { starterPosts } from "@/lib/starterPosts";
import { getStoredJson, setStoredJson } from "@/lib/storage";
import type { Post } from "@/types/posts";

const likedPostsStorageKey = "pick-liked-posts";

function formatPostDate(post: Post) {
	if (!post.createdAt) return post.date;
	const createdAt = new Date(post.createdAt);
	return Number.isNaN(createdAt.getTime()) ? post.date : createdAt.toLocaleString("ja-JP");
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		let isMounted = true;
		params.then(({ id }) => {
			const postId = Number(id);
			const foundPost = [...getUserPosts(), ...starterPosts].find((candidate) => candidate.id === postId) || null;
			if (isMounted) {
				setPost(foundPost);
				setIsLiked(getStoredJson<number[]>(likedPostsStorageKey, []).includes(postId));
				setIsLoading(false);
			}
		});
		return () => { isMounted = false; };
	}, [params]);

	function toggleLike() {
		if (!post) return;
		const likedPostIds = getStoredJson<number[]>(likedPostsStorageKey, []);
		const nextLikedPostIds = likedPostIds.includes(post.id)
			? likedPostIds.filter((postId) => postId !== post.id)
			: [...likedPostIds, post.id];
		setStoredJson(likedPostsStorageKey, nextLikedPostIds);
		setIsLiked(nextLikedPostIds.includes(post.id));
		if (nextLikedPostIds.includes(post.id)) {
			addLikedNotification(post.id);
		} else {
			removeLikedNotification(post.id);
		}
	}

	return (
		<main className="site-shell">
			<Header activePage="feed" />
			{isLoading ? <p className="post-detail-status">投稿を読み込んでいます...</p> : post ? (
				<article className="post-detail">
					<Link className="back-link" href="/">← みんなの投稿へ戻る</Link>
					<div className="post-detail-image-wrap"><img className="post-detail-image" src={post.image} alt={`${post.name}さんの購入品`} /></div>
					<div className="post-detail-content">
						<span className="post-category">{post.category}</span>
						<h1>{post.title || "お気に入りの購入品"}</h1>
						<div className="post-detail-meta"><span className="avatar">{post.avatar}</span><Link className="user-link" href={`/users/${encodeURIComponent(post.name)}`}>{post.name}</Link><FollowButton userName={post.name} /><span>{formatPostDate(post)}</span></div>
						<p className="post-detail-description">{post.description}</p>
						{post.placeUrl && <div className="post-links"><a className="place-link" href={post.placeUrl} target="_blank" rel="noreferrer">購入場所を見る ↗</a></div>}
						<div className="post-detail-actions"><LikeButton liked={isLiked} count={post.likes + (isLiked ? 1 : 0)} onClick={toggleLike} label={`${post.name}さんの投稿にいいね`} /><BookmarkButton postId={post.id} /></div>
						<CommentSection postId={post.id} />
					</div>
				</article>
			) : <div className="post-detail-status"><h1>投稿が見つかりません</h1><Link href="/">投稿一覧へ戻る</Link></div>}
		</main>
	);
}