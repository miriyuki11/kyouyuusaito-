"use client";

type RatingStarsProps = { rating: number; onChange: (rating: number) => void; label?: string };

export default function RatingStars({ rating, onChange, label = "自分の評価" }: RatingStarsProps) {
	return <div className="rating-row" aria-label={`${rating}つ星で評価`}>
		<span className="rating-label">{label}</span>
		{[1, 2, 3, 4, 5].map((star) => <button className={star <= rating ? "rating-star selected" : "rating-star"} key={star} type="button" onClick={() => onChange(star)} aria-label={`${star}つ星`}>★</button>)}
	</div>;
}