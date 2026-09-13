"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getStoredValue, setStoredValue } from "@/lib/storage";

const profileUsernameStorageKey = "pick-profile-username";
const defaultProfileUsername = "あなた";

export default function ProfileUsername() {
	const [username, setUsername] = useState("");
	const [draftUsername, setDraftUsername] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		let isMounted = true;
		async function loadUsername() {
			let savedUsername = getStoredValue(profileUsernameStorageKey, defaultProfileUsername);

			try {
				const supabase = createSupabaseBrowserClient();
				const { data } = await supabase.auth.getUser();
				const authUsername = data.user?.user_metadata?.display_name;
				if (typeof authUsername === "string" && authUsername.trim()) {
					savedUsername = authUsername.trim();
					setStoredValue(profileUsernameStorageKey, savedUsername);
				}
			} catch { }

			if (isMounted) {
				setUsername(savedUsername);
				setDraftUsername(savedUsername);
			}
		}

		loadUsername();
		return () => { isMounted = false; };
	}, []);

	async function saveUsername() {
		const nextUsername = draftUsername.trim() || defaultProfileUsername;
		setUsername(nextUsername);
		setDraftUsername(nextUsername);
		setStoredValue(profileUsernameStorageKey, nextUsername);

		try {
			const supabase = createSupabaseBrowserClient();
			await supabase.auth.updateUser({ data: { display_name: nextUsername } });
		} catch { }

		setIsEditing(false);
	}

	if (isEditing) {
		return (
			<div className="profile-username-editor">
				<input value={draftUsername} onChange={(event) => setDraftUsername(event.target.value)} maxLength={30} aria-label="ユーザーネーム" autoFocus />
				<div className="profile-username-actions">
					<button type="button" onClick={saveUsername}>保存</button>
					<button type="button" onClick={() => { setDraftUsername(username); setIsEditing(false); }}>キャンセル</button>
				</div>
			</div>
		);
	}

	return (
		<div className="profile-username-row">
			<strong>{username}</strong>
			<button type="button" onClick={() => setIsEditing(true)}>ユーザーネームを編集</button>
		</div>
	);
}