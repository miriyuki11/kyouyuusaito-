"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header/Header";
import PostCard from "@/app/components/PostCard/PostCard";
import { getUserPosts, type Post } from "@/lib/posts";
import { starterPosts } from "@/lib/starterPosts";

export default function UserProfilePage({ params }: { params: Promise<{ name: string }> }) {
	const [userName, setUserName] = useState("");
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		let isMounted = true;
		params.then(({ name }) => {
			const decodedName = decodeURIComponent(name);
			if (!isMounted) return;
			setUserName(decodedName);
			const allPosts = [...getUserPosts(), ...starterPosts];
			setPosts(allPosts.filter((post) => post.name === decodedName));
		});
		return () => { isMounted = false; };
	}, [params]);

	return (
		<main className="site-shell mypage-shell">
			<Header activePage="mypage" />
			<section className="profile-header">
				<div className="profile-avatar" aria-label={`${userName}のプロフィール画像`}>{userName.slice(0, 2).toUpperCase() || "U"}</div>
				<div>
					<p className="section-kicker">profile</p>
					<h1 style={{ margin: 0 }}>{userName || "ユーザー"}</h1>
					<p>このユーザーの投稿一覧</p>
				</div>
			</section>

			<section className="mypage-content">
				<div className="mypage-heading">
					<h2>{userName || "ユーザー"}の投稿</h2>
					<Link className="back-link" href="/">← みんなの投稿へ戻る</Link>
				</div>
				{posts.length === 0 ? (
					<div className="empty-posts">
						<div className="empty-mark">＋</div>
						<h3>まだ投稿がありません</h3>
						<p>このユーザーはまだ購入品を共有していません。</p>
					</div>
				) : (
					<div className="post-grid my-post-grid">
						{posts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
					</div>
				)}
			</section>
		</main>
	);
}
