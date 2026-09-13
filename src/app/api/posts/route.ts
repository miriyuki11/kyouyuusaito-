import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Post } from "@/lib/posts";

type PostRow = Post & {
	user_id: string;
};

function createSupabaseServerClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!supabaseUrl || !supabasePublishableKey) {
		throw new Error("Supabaseの環境変数が設定されていません。");
	}

	return createClient(supabaseUrl, supabasePublishableKey);
}

export async function GET() {
	try {
		const supabase = createSupabaseServerClient();
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data satisfies PostRow[]);
	} catch (error) {
		const message = error instanceof Error ? error.message : "投稿を取得できませんでした。";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<Post> & { user_id?: string };

		if (!body.title || !body.name || !body.category || !body.description || !body.image || !body.avatar) {
			return NextResponse.json({ error: "投稿に必要な項目が不足しています。" }, { status: 400 });
		}

		const supabase = createSupabaseServerClient();
		const { data, error } = await supabase
			.from("posts")
			.insert({
				title: body.title,
				name: body.name,
				category: body.category,
				description: body.description,
				place_url: body.placeUrl || null,
				labels: body.labels || [],
				image: body.image,
				avatar: body.avatar,
				user_id: body.user_id || null,
				likes: 0,
			})
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "投稿を作成できませんでした。";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}