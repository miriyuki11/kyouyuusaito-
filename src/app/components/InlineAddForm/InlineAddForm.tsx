"use client";

import { FormEvent } from "react";

type InlineAddFormProps = { name: string; placeholder: string; onSubmit: (value: string) => void };

export default function InlineAddForm({ name, placeholder, onSubmit }: InlineAddFormProps) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const value = String(new FormData(event.currentTarget).get(name) || "").trim();
		if (!value) return;
		onSubmit(value);
		event.currentTarget.reset();
	}

	return <form className="new-label-form" onSubmit={handleSubmit}><input name={name} placeholder={placeholder} maxLength={24} autoFocus required /><button type="submit">追加</button></form>;
}