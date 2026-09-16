"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header/Header";
import LikedPostList from "@/app/components/LikedPostList/LikedPostList";
import { getBookmarkedPostIds } from "@/lib/bookmarks";
import { getUserPosts, type Post } from "@/lib/posts";
import { starterPosts } from "@/lib/starterPosts";

export default function SavedPostsPage() {
	const [savedPosts, setSavedPosts] = useState<Post[]>([]);

	useEffect(() => {
		const loadSavedPosts = window.setTimeout(() => {
			const bookmarkedPostIds = getBookmarkedPostIds();
			const allPosts = [...getUserPosts(), ...starterPosts];
			setSavedPosts(allPosts.filter((post) => bookmarkedPostIds.includes(post.id)));
		}, 0);
		return () => window.clearTimeout(loadSavedPosts);
	}, []);

	return (
		<main className="site-shell mypage-shell">
			<Header activePage="mypage" />
			<section className="mypage-content">
				<div className="mypage-heading">
					<h2>保存した投稿</h2>
					<Link className="back-link" href="/mypage">← マイページへ戻る</Link>
				</div>
				<LikedPostList posts={savedPosts} emptyTitle="保存した投稿はまだありません" emptyDescription="気に入った投稿を保存して、あとで見返せます。" emptyMark="☆" />
			</section>
		</main>
	);
}