"use client";

import { useEffect, useState } from "react";
import { getStoredValue, setStoredValue } from "@/lib/storage";

const profileBioStorageKey = "pick-profile-bio";
const defaultProfileBio = "最近買ってよかったものをシェアしています。";

export default function ProfileBio() {
	const [profileBio, setProfileBio] = useState("");
	const [draftProfileBio, setDraftProfileBio] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const loadProfileBio = window.setTimeout(() => {
			const savedBio = getStoredValue(profileBioStorageKey, defaultProfileBio);
			setProfileBio(savedBio);
			setDraftProfileBio(savedBio);
		}, 0);
		return () => window.clearTimeout(loadProfileBio);
	}, []);

	function saveProfileBio() {
		const nextBio = draftProfileBio.trim() || defaultProfileBio;
		setProfileBio(nextBio);
		setDraftProfileBio(nextBio);
		setStoredValue(profileBioStorageKey, nextBio);
		setIsEditing(false);
	}

	if (isEditing) {
		return (
			<div className="profile-bio-editor">
				<textarea value={draftProfileBio} onChange={(event) => setDraftProfileBio(event.target.value)} maxLength={120} rows={2} aria-label="自己紹介" />
				<div className="profile-bio-actions">
					<button type="button" onClick={saveProfileBio}>保存</button>
					<button type="button" onClick={() => { setDraftProfileBio(profileBio); setIsEditing(false); }}>キャンセル</button>
				</div>
			</div>
		);
	}

	return (
		<div className="profile-bio-row">
			<p>{profileBio}</p>
			<button type="button" onClick={() => setIsEditing(true)}>自己紹介を編集</button>
		</div>
	);
}