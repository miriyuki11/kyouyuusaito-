"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FeedPosts from "@/app/components/FeedPosts/FeedPosts";
import Header from "@/app/components/Header/Header";
import { getPostRatings, getUserPosts, type Post, savePostRatings } from "@/lib/posts";
import { sortPosts } from "@/lib/postSort";
import { starterPosts } from "@/lib/starterPosts";
import type { PostSortKey } from "@/types/posts";

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get("q")?.trim() || "";
	const [searchQuery, setSearchQuery] = useState(query);
	const [posts, setPosts] = useState<Post[]>(starterPosts);
	const [userPostIds, setUserPostIds] = useState<number[]>([]);
	const [ratings, setRatings] = useState<Record<number, number>>({});
	const [sortKey, setSortKey] = useState<PostSortKey>("newest");

	useEffect(() => {
		const loadPosts = window.setTimeout(() => {
			const userPosts = getUserPosts();
			setPosts([...userPosts, ...starterPosts]);
			setUserPostIds(userPosts.map((post) => post.id));
			setRatings(getPostRatings());
		}, 0);
		return () => window.clearTimeout(loadPosts);
	}, []);

	const normalizedQuery = query.toLowerCase();
	const results = normalizedQuery
		? posts.filter((post) => [post.title, post.description, post.name, post.category].some((value) => (value || "").toLowerCase().includes(normalizedQuery)))
		: [];
	const sortedResults = sortPosts(results, sortKey, "desc", ratings);

	function submitSearch() {
		const nextQuery = searchQuery.trim();
		if (nextQuery) router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
	}

	function ratePost(id: number, rating: number) {
		setRatings((current) => {
			const nextRatings = { ...current, [id]: rating };
			savePostRatings(nextRatings);
			return nextRatings;
		});
	}

	return (
		<main className="site-shell">
			<Header activePage="feed" searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={submitSearch} />
			<section className="feed-section search-page">
				<div className="feed-toolbar">
					<div>
						<p className="section-kicker">search results</p>
						<h1>「{query || "検索キーワード"}」の投稿</h1>
					</div>
					<div className="search-options">
						<p className="search-count">{results.length}件</p>
						<select className="search-sort" value={sortKey} onChange={(event) => setSortKey(event.target.value as PostSortKey)} aria-label="検索結果の並び替え">
							<option value="newest">新着順</option>
							<option value="likes">いいね順</option>
							<option value="rating">星評価順</option>
						</select>
					</div>
				</div>
				{query && results.length > 0 ? (
					<FeedPosts posts={sortedResults} userPostIds={userPostIds} ratings={ratings} onRate={ratePost} />
				) : (
					<p className="search-empty">{query ? "該当する投稿は見つかりませんでした。" : "検索キーワードを入力してください。"}</p>
				)}
			</section>
		</main>
	);
}