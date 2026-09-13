"use client";

import { useEffect, useState } from "react";
import { getStoredJson, setStoredJson } from "@/lib/storage";

const followedUsersStorageKey = "pick-followed-users";

type FollowButtonProps = {
	userName: string;
};

function getFollowedUsers(): string[] {
	return getStoredJson<string[]>(followedUsersStorageKey, []);
}

export default function FollowButton({ userName }: FollowButtonProps) {
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const loadFollowState = window.setTimeout(() => {
			setIsFollowing(getFollowedUsers().includes(userName));
		}, 0);
		return () => window.clearTimeout(loadFollowState);
	}, [userName]);

	function toggleFollow() {
		const followedUsers = getFollowedUsers();
		const nextUsers = followedUsers.includes(userName)
			? followedUsers.filter((followedUser) => followedUser !== userName)
			: [...followedUsers, userName];
		setStoredJson(followedUsersStorageKey, nextUsers);
		setIsFollowing(nextUsers.includes(userName));
	}

	return (
		<button className={isFollowing ? "follow-button following" : "follow-button"} type="button" onClick={toggleFollow} aria-label={`${userName}さんを${isFollowing ? "フォロー解除" : "フォロー"}`}>
			{isFollowing ? "フォロー中" : "フォローする"}
		</button>
	);
}