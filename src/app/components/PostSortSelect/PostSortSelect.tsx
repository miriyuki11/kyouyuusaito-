"use client";

import SortDirectionButtons from "@/app/components/SortDirectionButtons/SortDirectionButtons";
import type { PostSortKey, SortDirection } from "@/types/posts";
export type { PostSortKey, SortDirection } from "@/types/posts";

type PostSortSelectProps = {
	value: PostSortKey;
	direction: SortDirection;
	onSortKeyChange: (sortKey: PostSortKey) => void;
	onDirectionChange: (direction: SortDirection) => void;
};

export default function PostSortSelect({ value, direction, onSortKeyChange, onDirectionChange }: PostSortSelectProps) {
	return (
		<div className="sort-control">
			<span>並び順</span>
			<select value={value} onChange={(event) => onSortKeyChange(event.target.value as PostSortKey)} aria-label="投稿の並び替え対象">
				<option value="newest">投稿日</option>
				<option value="likes">いいね数</option>
				<option value="rating">自己評価</option>
			</select>
			<SortDirectionButtons direction={direction} onChange={onDirectionChange} />
		</div>
	);
}