import Link from "next/link";
import AuthButton from "./AuthButton";
import PostButton from "./PostButton";

type HeaderProps = {
	activePage: "feed" | "mypage";
	onPostClick?: () => void;
};

export default function Header({ activePage, onPostClick }: HeaderProps) {
	return (
		<header className="site-header">
			<Link className="brand" href="/" aria-label="pick home">
				<span className="brand-mark">p</span>
				<span>pick</span>
			</Link>
			<nav className="main-nav" aria-label="メインナビゲーション">
				{activePage === "feed" ? (
					<a className="nav-link active" href="#feed" aria-current="page">みんなの投稿</a>
				) : (
					<Link className="nav-link" href="/">みんなの投稿</Link>
				)}
				{activePage === "feed" ? (
					<a className="nav-link" href="#about">ピックについて</a>
				) : (
					<span className="nav-link active" aria-current="page">マイページ</span>
				)}
			</nav>
			<div className="header-actions">
				<Link className="mypage-link" href="/mypage">マイページ</Link>
				<AuthButton />
				<PostButton onClick={onPostClick} />
			</div>
		</header>
	);
}