"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useEffect } from "react";
import InlineAddForm from "@/app/components/InlineAddForm/InlineAddForm";
import { Post, saveUserCategories } from "@/lib/posts";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PurchasePostFormProps = {
	categories: string[];
	onCategoryAdded: (categories: string[]) => void;
	onClose: () => void;
	onSubmit: (post: Post, rating: number) => void;
};

export default function PurchasePostForm({ categories, onCategoryAdded, onClose, onSubmit }: PurchasePostFormProps) {
	const [selectedImage, setSelectedImage] = useState("");
	const [selectedRating, setSelectedRating] = useState(0);
	const [authorName, setAuthorName] = useState("あなた");
	const [isAuthorLoading, setIsAuthorLoading] = useState(true);
	const [isCreatingCategory, setIsCreatingCategory] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let isMounted = true;
		async function loadAuthorName() {
			try {
				const supabase = createSupabaseBrowserClient();
				const { data } = await supabase.auth.getUser();
				const displayName = data.user?.user_metadata?.display_name;
				if (isMounted && typeof displayName === "string" && displayName.trim()) {
					setAuthorName(displayName.trim());
				}
			} catch { }
			finally {
				if (isMounted) setIsAuthorLoading(false);
			}
		}

		loadAuthorName();
		return () => { isMounted = false; };
	}, []);

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) setSelectedImage(URL.createObjectURL(file));
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const name = authorName;
		const post: Post = {
			id: Date.now(),
			title: String(form.get("title") || "お気に入りの購入品"),
			name,
			category: String(form.get("category") || "暮らし"),
			description: String(form.get("description") || ""),
			placeUrl: String(form.get("placeUrl") || ""),
			image: selectedImage || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
			avatar: name.slice(0, 2).toUpperCase(),
			date: "たった今",
			createdAt: new Date().toISOString(),
			likes: 0,
		};

		onSubmit(post, selectedRating);
	}

	function handleCategorySelection(event: ChangeEvent<HTMLSelectElement>) {
		if (event.target.value === "__create__") {
			setIsCreatingCategory(true);
			event.target.value = categories[1] || "暮らし";
		}
	}

	function addCustomCategory(newCategory: string) {
		const nextCategories = Array.from(new Set([...categories.filter((category) => category !== "すべて"), newCategory]));
		onCategoryAdded(nextCategories);
		saveUserCategories(nextCategories);
		setIsCreatingCategory(false);
	}

	return (
		<div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
			<section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
				<button className="close-button" type="button" onClick={onClose} aria-label="閉じる">×</button>
				<p className="section-kicker">new pick</p>
				<h2 id="composer-title">購入品を投稿する</h2>
				<form onSubmit={handleSubmit}>
					<button className="upload-area" type="button" onClick={() => fileInputRef.current?.click()}>
						{selectedImage ? <img src={selectedImage} alt="選択した購入品" /> : <><span className="upload-icon">＋</span><span>写真を選ぶ</span><small>JPG / PNG</small></>}
					</button>
					<input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={handleImageChange} />
					<div className="composer-rating" aria-label={`${selectedRating}つ星で評価`}>
						{[1, 2, 3, 4, 5].map((star) => <button className={star <= selectedRating ? "rating-star selected" : "rating-star"} key={star} type="button" onClick={() => setSelectedRating(star)} aria-label={`${star}つ星`}>★</button>)}
					</div>
					<label>タイトル<input name="title" placeholder="例：ずっと欲しかったコーヒーミル" maxLength={50} required /></label>
					<label>カテゴリー<select name="category" defaultValue="暮らし" onChange={handleCategorySelection}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}<option value="__create__">＋ 自分で作成</option></select></label>
					{isCreatingCategory && <InlineAddForm name="newCategory" placeholder="新しいカテゴリー名" onSubmit={addCustomCategory} />}
					<label>購入した場所のURL <span className="optional-label">任意</span><input name="placeUrl" type="url" placeholder="https://example.com/item" /></label>
					<label>ひとこと<textarea name="description" placeholder="どんなところが気に入った？" rows={3} required /></label>
					<button className="submit-button" type="submit" disabled={isAuthorLoading}>{isAuthorLoading ? "ユーザー情報を読み込み中..." : "投稿をシェアする"}</button>
				</form>
			</section>
		</div>
	);
}