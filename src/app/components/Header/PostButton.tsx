import Link from "next/link";

type PostButtonProps = {
	onClick?: () => void;
};

export default function PostButton({ onClick }: PostButtonProps) {
	if (onClick) {
		return (
			<button className="header-post-button" type="button" onClick={onClick}>
				<span aria-hidden="true">＋</span> 投稿する
			</button>
		);
	}

	return (
		<Link className="header-post-button" href="/#feed">
			投稿する
		</Link>
	);
}