import PostCard from "@/app/components/PostCard/PostCard";
import type { Post } from "@/lib/posts";

type LikedPostListProps = {
	posts: Post[];
	emptyTitle?: string;
	emptyDescription?: string;
	emptyMark?: string;
};

export default function LikedPostList({ posts, emptyTitle = "いいねした投稿はまだありません", emptyDescription = "気に入った投稿にいいねして、あとで見返せます。", emptyMark = "♡" }: LikedPostListProps) {
	if (posts.length === 0) {
		return (
			<div className="empty-posts">
				<div className="empty-mark">{emptyMark}</div>
				<h3>{emptyTitle}</h3>
				<p>{emptyDescription}</p>
			</div>
		);
	}

	return (
		<div className="post-grid my-post-grid">
			{posts.map((post, index) => (
				<PostCard key={post.id} post={post} index={index} />
			))}
		</div>
	);
}
