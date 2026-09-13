"use client";

import type { SortDirection } from "@/types/posts";

type SortDirectionButtonsProps = {
	direction: SortDirection;
	onChange: (direction: SortDirection) => void;
};

export default function SortDirectionButtons({ direction, onChange }: SortDirectionButtonsProps) {
	return (
		<div className="sort-direction-buttons" role="group" aria-label="並び順の方向">
			<button className="selected" type="button" onClick={() => onChange(direction === "asc" ? "desc" : "asc")} aria-label={`クリックして${direction === "asc" ? "降順" : "昇順"}に変更`}>
				{direction === "asc" ? "昇順" : "降順"}
			</button>
		</div>
	);
}