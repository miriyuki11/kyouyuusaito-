"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryTabs from "@/app/components/CategoryTabs/CategoryTabs";
import FeedPosts from "@/app/components/FeedPosts/FeedPosts";
import Header from "@/app/components/Header/Header";
import PurchasePostForm from "@/app/components/PurchasePostForm/PurchasePostForm";
import { defaultCategories, getPostRatings, getUserCategories, getUserPosts, Post, savePostRatings, saveUserPosts } from "@/lib/posts";
import { starterPosts } from "@/lib/starterPosts";

export default function Home() {
	const router = useRouter();
	const [posts, setPosts] = useState<Post[]>(starterPosts);
	const [categories, setCategories] = useState(["すべて", ...defaultCategories]);
	const [userPostIds, setUserPostIds] = useState<number[]>([]);
	const [activeCategory, setActiveCategory] = useState("すべて");
	const [searchQuery, setSearchQuery] = useState("");
	const [isComposerOpen, setIsComposerOpen] = useState(false);
	const [ratings, setRatings] = useState<Record<number, number>>({});

	useEffect(() => {
		const loadSavedPosts = window.setTimeout(() => {
			const savedPosts = getUserPosts();
			setPosts([...savedPosts, ...starterPosts]);
			setUserPostIds(savedPosts.map((post) => post.id));
		}, 0);
		return () => window.clearTimeout(loadSavedPosts);
	}, []);

	useEffect(() => {
		const loadCategories = window.setTimeout(() => setCategories(["すべて", ...getUserCategories()]), 0);
		return () => window.clearTimeout(loadCategories);
	}, []);

	useEffect(() => {
		const loadRatings = window.setTimeout(() => setRatings(getPostRatings()), 0);
		return () => window.clearTimeout(loadRatings);
	}, []);

	const categoryPosts = activeCategory === "すべて"
		? posts
		: posts.filter((post) => post.category === activeCategory);
	function handlePostSubmit(newPost: Post, selectedRating: number) {
		setPosts((current) => [newPost, ...current]);
		setUserPostIds((current) => [newPost.id, ...current]);
		if (selectedRating > 0) {
			savePostRatings({ ...getPostRatings(), [newPost.id]: selectedRating });
			setRatings((current) => ({ ...current, [newPost.id]: selectedRating }));
		}
		saveUserPosts([newPost, ...getUserPosts()]);
		setIsComposerOpen(false);
	}

	function ratePost(id: number, rating: number) {
		setRatings((current) => {
			const nextRatings = { ...current, [id]: rating };
			savePostRatings(nextRatings);
			return nextRatings;
		});
	}

	function submitSearch() {
		const query = searchQuery.trim();
		if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
	}

	return (
		<main className="site-shell">
			<Header activePage="feed" onPostClick={() => setIsComposerOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={submitSearch} />

			<section className="intro" id="about">
				<div>
					<p className="eyebrow">share what you picked</p>
					<h1>最近買ってよかったものを、<br /><em>みんなにシェア。</em></h1>
					<p className="intro-copy">あなたの「これ、よかった」を残す場所。<br />写真とひとことから、次のお気に入りが見つかります。</p>
				</div>
				<div className="intro-note" aria-hidden="true">
					<span>good<br />things</span>
					<span className="note-line" />
					<span>picked by<br />friends</span>
				</div>
			</section>

			<section className="feed-section" id="feed">
				<div className="feed-toolbar">
					<div>
						<p className="section-kicker">community picks</p>
						<h2>みんなの最近の購入品</h2>
					</div>
					<CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />
				</div>

				<FeedPosts posts={categoryPosts} userPostIds={userPostIds} ratings={ratings} onRate={ratePost} />
			</section>

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
