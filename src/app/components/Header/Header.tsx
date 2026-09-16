import Link from "next/link";
import AuthButton from "./AuthButton";
import PostButton from "./PostButton";

type HeaderProps = {
	activePage: "feed" | "mypage";
	onPostClick?: () => void;
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	onSearchSubmit?: () => void;
};

export default function Header({ activePage, onPostClick, searchQuery = "", onSearchChange, onSearchSubmit }: HeaderProps) {
	return (
		<header className="site-header">
			<Link className="brand" href="/" aria-label="pick home">
				<span className="brand-mark">p</span>
				<span>pick</span>
			</Link>
			{activePage === "feed" && onSearchChange && onSearchSubmit && (
				<form className="header-search" onSubmit={(event) => { event.preventDefault(); onSearchSubmit(); }}>
					<span className="visually-hidden">投稿を検索</span>
					<span className="header-search-icon" aria-hidden="true">⌕</span>
					<input value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="投稿を検索" aria-label="投稿を検索" />
				</form>
			)}
			<div className="header-actions">
				<Link className="notification-link" href="/mypage/notifications" aria-label="通知を見る">通知</Link>
				<Link className="mypage-link" href="/mypage">マイページ</Link>
				<AuthButton />
				<PostButton onClick={onPostClick} />
			</div>
		</header>
	);
}