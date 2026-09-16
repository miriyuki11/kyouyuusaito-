"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header/Header";
import { getCommentNotifications, type PostNotification } from "@/lib/notifications";
import { getUserPosts, type Post } from "@/lib/posts";

export default function CommentNotificationsPage() {
	const [notifications, setNotifications] = useState<PostNotification[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const loadNotifications = window.setTimeout(() => {
			setNotifications(getCommentNotifications().sort((a, b) => b.id - a.id));
			setPosts(getUserPosts());
		}, 0);
		return () => window.clearTimeout(loadNotifications);
	}, []);

	const ownPosts = new Map(posts.map((post) => [post.id, post]));
	const visibleNotifications = notifications.filter((notification) => ownPosts.has(notification.postId));

	return (
		<main className="site-shell mypage-shell">
			<Header activePage="mypage" />
			<section className="mypage-content">
				<div className="mypage-heading">
					<h2>コメントされました</h2>
					<Link className="back-link" href="/mypage">← マイページへ戻る</Link>
				</div>
				{visibleNotifications.length === 0 ? (
					<div className="empty-posts"><div className="empty-mark">□</div><h3>まだ通知はありません</h3><p>あなたの投稿にコメントが付くと、ここに表示されます。</p></div>
				) : (
					<ul className="notification-list">
						{visibleNotifications.map((notification) => {
							const post = ownPosts.get(notification.postId);
							if (!post) return null;
							return <li className="notification-item" key={notification.id}><span className="notification-mark">□</span><div><p><strong>{notification.actorName}</strong> が「{post.title || "お気に入りの購入品"}」にコメントしました。</p><Link href={`/posts/${post.id}`}>投稿を見る</Link></div></li>;
						})}
					</ul>
				)}
			</section>
		</main>
	);
}