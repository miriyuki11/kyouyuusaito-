import PostCard from "@/app/components/PostCard/PostCard";
import type { Post } from "@/lib/posts";

type LikedPostListProps = {
	posts: Post[];
};

export default function LikedPostList({ posts }: LikedPostListProps) {
	if (posts.length === 0) {
		return (
			<div className="empty-posts">
				<div className="empty-mark">♡</div>
				<h3>いいねした投稿はまだありません</h3>
				<p>気に入った投稿にいいねして、あとで見返せます。</p>
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
