"use client";

type LikeButtonProps = { liked: boolean; count: number; onClick: () => void; label: string };

export default function LikeButton({ liked, count, onClick, label }: LikeButtonProps) {
	return <button className={liked ? "like-button liked" : "like-button"} onClick={onClick} type="button" aria-label={label}><span aria-hidden="true">♡</span> {count}</button>;
}