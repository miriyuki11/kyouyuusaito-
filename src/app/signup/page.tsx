"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!displayName.trim()) {
      setError("ユーザー名を入力してください。");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません。");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user && !data.session) {
        setMessage("確認メールを送信しました。メール内のリンクを開いて登録を完了してください。");
        return;
      }

      setMessage("登録が完了しました。ログイン画面からログインしてください。");
    } catch {
      setError("登録を開始できませんでした。.env.local の Supabase 設定を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 text-zinc-900">
      <section className="w-full max-w-md border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-medium text-teal-700">アカウント作成</p>
        <h1 className="mt-2 text-3xl font-semibold">新規登録</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          メールアドレスとパスワードを入力してください。
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" htmlFor="display-name">
            ユーザー名
            <input
              className="mt-2 h-11 w-full border border-zinc-300 px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="display-name"
              type="text"
              autoComplete="name"
              maxLength={30}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium" htmlFor="password-confirmation">
            パスワード（確認）
            <input
              className="mt-2 h-11 w-full border border-zinc-300 px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              id="password-confirmation"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="border-l-4 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="border-l-4 border-teal-700 bg-teal-50 px-3 py-2 text-sm text-teal-900" role="status">
              {message}
            </p>
          )}

          <button
            className="h-11 w-full bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "新規登録する"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          すでにアカウントをお持ちですか？ {" "}
          <Link className="font-semibold text-teal-700 underline" href="/login">
            ログイン
          </Link>
        </p>
      </section>
    </main>
  );
}