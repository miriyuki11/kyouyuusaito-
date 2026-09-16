"use client";

import { useEffect, useState } from "react";
import { getBookmarkedPostIds, toggleBookmarkedPost } from "@/lib/bookmarks";

type BookmarkButtonProps = {
	postId: number;
};

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		const loadBookmarkState = window.setTimeout(() => {
			setIsBookmarked(getBookmarkedPostIds().includes(postId));
		}, 0);
		return () => window.clearTimeout(loadBookmarkState);
	}, [postId]);

	function handleClick() {
		setIsBookmarked(toggleBookmarkedPost(postId));
	}

	return (
		<button className={`bookmark-button${isBookmarked ? " bookmarked" : ""}`} type="button" onClick={handleClick} aria-pressed={isBookmarked} aria-label={isBookmarked ? "保存を解除" : "投稿を保存"}>
			<svg className="bookmark-icon" viewBox="0 0 20 22" aria-hidden="true" fill={isBookmarked ? "currentColor" : "none"}>
				<path d="M4.5 2.5h11A1.5 1.5 0 0 1 17 4v15l-6-3.5L5 19V4a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			</svg>
			<span>{isBookmarked ? "保存済み" : "保存"}</span>
		</button>
	);
}