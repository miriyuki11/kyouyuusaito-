"use client";

import { FormEvent, useEffect, useState } from "react";
import { getStoredJson, setStoredJson } from "@/lib/storage";
import { addCommentNotification } from "@/lib/notifications";

const commentsStorageKey = "pick-post-comments";

export type PostComment = {
	id: number;
	text: string;
	createdAt: string;
};

type CommentSectionProps = {
	postId: number;
};

type StoredComments = Record<number, PostComment[]>;

export default function CommentSection({ postId }: CommentSectionProps) {
	const [comments, setComments] = useState<PostComment[]>([]);
	const [draft, setDraft] = useState("");

	useEffect(() => {
		const loadComments = window.setTimeout(() => {
			setComments(getStoredJson<StoredComments>(commentsStorageKey, {})[postId] || []);
		}, 0);
		return () => window.clearTimeout(loadComments);
	}, [postId]);

	function addComment(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const text = draft.trim();
		if (!text) return;

		const nextComment: PostComment = {
			id: Date.now(),
			text,
			createdAt: new Date().toISOString(),
		};
		const storedComments = getStoredJson<StoredComments>(commentsStorageKey, {});
		const nextComments = [...(storedComments[postId] || []), nextComment];
		setStoredJson(commentsStorageKey, { ...storedComments, [postId]: nextComments });
		addCommentNotification(postId);
		setComments(nextComments);
		setDraft("");
	}

	return (
		<section className="comment-section" aria-label="コメント">
			<div className="comment-heading"><span>コメント</span><span>{comments.length}</span></div>
			{comments.length > 0 && <ul className="comment-list">{comments.map((comment) => <li key={comment.id}>{comment.text}</li>)}</ul>}
			<form className="comment-form" onSubmit={addComment}>
				<input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="コメントを書く" maxLength={200} aria-label="コメント" />
				<button type="submit">送信</button>
			</form>
		</section>
	);
}