"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header/Header";
import MyPostList from "@/app/components/MyPostList/MyPostList";
import PostSortSelect from "@/app/components/PostSortSelect/PostSortSelect";
import ProfileAvatar from "@/app/components/ProfileAvatar/ProfileAvatar";
import ProfileBio from "@/app/components/ProfileBio/ProfileBio";
import ProfileUsername from "@/app/components/ProfileUsername/ProfileUsername";
import PurchasePostForm from "@/app/components/PurchasePostForm/PurchasePostForm";
import ShareProfileModal from "@/app/components/ShareProfileModal/ShareProfileModal";
import { defaultCategories, getPostRatings, getUserCategories, getUserPosts, Post, savePostRatings, saveUserPosts } from "@/lib/posts";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { sortPosts } from "@/lib/postSort";
import { getStoredValue, setStoredValue } from "@/lib/storage";
import type { PostSortKey, SortDirection } from "@/types/posts";

export default function MyPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [userId, setUserId] = useState("");
	const [origin] = useState(() => typeof window === "undefined" ? "" : window.location.origin);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isComposerOpen, setIsComposerOpen] = useState(false);
	const [categories, setCategories] = useState(["すべて", ...defaultCategories]);
	const [ratings, setRatings] = useState<Record<number, number>>({});
	const [sortKey, setSortKey] = useState<PostSortKey>("newest");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	useEffect(() => {
		const loadSavedPosts = window.setTimeout(() => setPosts(getUserPosts()), 0);
		return () => window.clearTimeout(loadSavedPosts);
	}, []);

	useEffect(() => {
		const loadRatings = window.setTimeout(() => setRatings(getPostRatings()), 0);
		return () => window.clearTimeout(loadRatings);
	}, []);

	useEffect(() => {
		const loadCategories = window.setTimeout(() => setCategories(["すべて", ...getUserCategories()]), 0);
		return () => window.clearTimeout(loadCategories);
	}, []);

	useEffect(() => {
		let isMounted = true;
		async function loadUserId() {
			try {
				const supabase = createSupabaseBrowserClient();
				const { data } = await supabase.auth.getUser();
				if (isMounted && data.user) {
					setUserId(data.user.id);
					return;
				}
			} catch { }

			const guestId = getStoredValue("pick-guest-user-id") || `guest-${crypto.randomUUID()}`;
			setStoredValue("pick-guest-user-id", guestId);
			if (isMounted) setUserId(guestId);
		}

		loadUserId();
		return () => { isMounted = false; };
	}, []);

	const shareUrl = userId && origin ? `${origin}/mypage?userId=${encodeURIComponent(userId)}` : "";

	function ratePost(id: number, rating: number) {
		setRatings((current) => {
			const nextRatings = { ...current, [id]: rating };
			savePostRatings(nextRatings);
			return nextRatings;
		});
	}

	function handlePostSubmit(newPost: Post, rating: number) {
		setPosts((current) => [newPost, ...current]);
		if (rating > 0) {
			const nextRatings = { ...getPostRatings(), [newPost.id]: rating };
			setRatings(nextRatings);
			savePostRatings(nextRatings);
		}
		saveUserPosts([newPost, ...getUserPosts()]);
		setIsComposerOpen(false);
	}

	const sortedPosts = sortPosts(posts, sortKey, sortDirection, ratings);

	return (
		<main className="site-shell mypage-shell">
			<Header activePage="mypage" onPostClick={() => setIsComposerOpen(true)} />

			<section className="profile-header">
				<ProfileAvatar />
				<div>
					<p className="section-kicker">your collection</p>
					<ProfileUsername />
					<ProfileBio />
				</div>
				<div className="profile-side">
					<button className="share-profile-button" type="button" onClick={() => setIsShareOpen(true)} disabled={!userId}>共有する</button>
				</div>
			</section>

			<section className="mypage-content">
				<div className="mypage-heading">
					<h2>自分の投稿</h2>
					{posts.length === 0 ? <span>まだ投稿はありません</span> : (
						<PostSortSelect
							value={sortKey}
							direction={sortDirection}
							onSortKeyChange={setSortKey}
							onDirectionChange={setSortDirection}
						/>
					)}
				</div>
				<div style={{ margin: "0 0 24px" }}>
					<Link className="empty-button" href="/mypage/likes">いいねした投稿を見る</Link>
				</div>
				{posts.length === 0 ? (
					<div className="empty-posts">
						<div className="empty-mark">＋</div>
						<h3>最初の購入品をシェアしよう</h3>
						<p>写真とひとことがあれば、すぐに投稿できます。</p>
						<button className="empty-button" type="button" onClick={() => setIsComposerOpen(true)}>投稿する</button>
					</div>
				) : (
					<MyPostList posts={sortedPosts} ratings={ratings} onRate={ratePost} />
				)}
			</section>

			{isShareOpen && <ShareProfileModal shareUrl={shareUrl} userId={userId} onClose={() => setIsShareOpen(false)} />}

			{isComposerOpen && (
				<PurchasePostForm
					categories={categories}
					onCategoryAdded={(nextCategories) => setCategories(["すべて", ...nextCategories])}
					onClose={() => setIsComposerOpen(false)}
					onSubmit={handlePostSubmit}
				/>
			)}
		</main>
	);
}