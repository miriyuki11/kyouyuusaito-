"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { getStoredValue, setStoredValue } from "@/lib/storage";

const profileAvatarStorageKey = "pick-profile-avatar";

export default function ProfileAvatar() {
	const [avatar, setAvatar] = useState("");

	useEffect(() => {
		const loadAvatar = window.setTimeout(() => setAvatar(getStoredValue(profileAvatarStorageKey)), 0);
		return () => window.clearTimeout(loadAvatar);
	}, []);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const nextAvatar = typeof reader.result === "string" ? reader.result : "";
			if (!nextAvatar) return;
			setAvatar(nextAvatar);
			setStoredValue(profileAvatarStorageKey, nextAvatar);
		};
		reader.readAsDataURL(file);
	}

	return <label className="profile-avatar" aria-label="プロフィール画像を変更">{avatar ? <img className="profile-avatar-image" src={avatar} alt="プロフィール画像" /> : "you"}<input className="visually-hidden" type="file" accept="image/*" onChange={handleChange} /></label>;
}