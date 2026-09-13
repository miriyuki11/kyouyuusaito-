"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthButton() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSigningOut, setIsSigningOut] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const supabase = createSupabaseBrowserClient();

		async function loadSession() {
			const { data } = await supabase.auth.getSession();
			if (isMounted) {
				setIsLoggedIn(Boolean(data.session));
				setIsLoading(false);
			}
		}

		loadSession();
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (isMounted) setIsLoggedIn(Boolean(session));
		});

		return () => {
			isMounted = false;
			authListener.subscription.unsubscribe();
		};
	}, []);

	async function handleSignOut() {
		setIsSigningOut(true);
		const supabase = createSupabaseBrowserClient();
		const { error } = await supabase.auth.signOut();

		if (error) {
			setIsSigningOut(false);
			return;
		}

		router.push("/login");
		router.refresh();
	}

	if (isLoading) return null;

	return isLoggedIn ? (
		<button className="auth-button" type="button" onClick={handleSignOut} disabled={isSigningOut}>
			{isSigningOut ? "ログアウト中..." : "ログアウト"}
		</button>
	) : (
		<Link className="auth-button" href="/login">ログイン</Link>
	);
}