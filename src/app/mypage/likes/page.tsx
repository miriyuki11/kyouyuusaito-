"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header/Header";
import LikedPostList from "@/app/components/LikedPostList/LikedPostList";
import { starterPosts } from "@/lib/starterPosts";
import { getUserPosts, type Post } from "@/lib/posts";
import { getStoredJson } from "@/lib/storage";

const likedPostsStorageKey = "pick-liked-posts";

export default function LikedPostsPage() {
	const [likedPosts, setLikedPosts] = useState<Post[]>([]);

	useEffect(() => {
		const loadLikedPosts = window.setTimeout(() => {
			const likedIds = getStoredJson<number[]>(likedPostsStorageKey, []);
			const allPosts = [...getUserPosts(), ...starterPosts];
			setLikedPosts(allPosts.filter((post) => likedIds.includes(post.id)));
		}, 0);
		return () => window.clearTimeout(loadLikedPosts);
	}, []);

	return (
		<main className="site-shell mypage-shell">
			<Header activePage="mypage" />
			<section className="mypage-content">
				<div className="mypage-heading">
					<h2>いいねした投稿</h2>
					<Link className="back-link" href="/mypage">← マイページへ戻る</Link>
				</div>
				<LikedPostList posts={likedPosts} />
			</section>
		</main>
	);
}
