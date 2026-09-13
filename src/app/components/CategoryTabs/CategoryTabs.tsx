"use client";

type CategoryTabsProps = { categories: string[]; activeCategory: string; onChange: (category: string) => void };

export default function CategoryTabs({ categories, activeCategory, onChange }: CategoryTabsProps) {
	return <div className="category-tabs" role="tablist" aria-label="カテゴリー">
		{categories.map((category) => <button key={category} className={activeCategory === category ? "category-tab selected" : "category-tab"} onClick={() => onChange(category)} type="button" role="tab" aria-selected={activeCategory === category}>{category}</button>)}
	</div>;
}