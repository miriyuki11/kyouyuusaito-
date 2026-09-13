"use client";

import { useState } from "react";

type ShareProfileModalProps = { shareUrl: string; userId: string; onClose: () => void };

export default function ShareProfileModal({ shareUrl, userId, onClose }: ShareProfileModalProps) {
	const [isCopied, setIsCopied] = useState(false);

	async function copyShareLink() {
		if (!shareUrl) return;
		await navigator.clipboard.writeText(shareUrl);
		setIsCopied(true);
		window.setTimeout(() => setIsCopied(false), 2000);
	}

	return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
		<section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
			<button className="close-button" type="button" onClick={onClose} aria-label="閉じる">×</button>
			<p className="section-kicker">share your picks</p><h2 id="share-title">マイページを共有する</h2>
			<p className="share-modal-copy">このQRコードまたはリンクを友達に送ると、あなたのページを共有できます。</p>
			<div className="qr-frame">{shareUrl && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`} alt="マイページ共有用QRコード" />}</div>
			<p className="user-id-label">USER ID <span>{userId}</span></p>
			<div className="share-link-row"><input readOnly value={shareUrl} aria-label="共有リンク" /><button type="button" onClick={copyShareLink}>{isCopied ? "コピーしました" : "リンクをコピー"}</button></div>
		</section>
	</div>;
}