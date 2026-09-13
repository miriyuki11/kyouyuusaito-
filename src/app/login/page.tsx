"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("メールアドレスまたはパスワードが正しくありません。");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("ログインできませんでした。.env.local の Supabase 設定を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 text-zinc-900">
      <section className="w-full max-w-md border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-medium text-teal-700">おかえりなさい</p>
        <h1 className="mt-2 text-3xl font-semibold">ログイン</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          登録したメールアドレスとパスワードを入力してください。
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" htmlFor="email">
            メールアドレス
            <input
              className="mt-2 h-11 w-full border border-zinc-300 px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium" htmlFor="password">
            パスワード
            <input
              className="mt-2 h-11 w-full border border-zinc-300 px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="border-l-4 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          <button
            className="h-11 w-full bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "ログインする"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          アカウントをお持ちでないですか？{" "}
          <Link className="font-semibold text-teal-700 underline" href="/signup">
            新規登録
          </Link>
        </p>
      </section>
    </main>
  );
}