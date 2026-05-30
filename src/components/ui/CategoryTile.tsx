import { Link } from 'react-router-dom';
import type { CategoryRow } from '../../services/api';

interface CategoryTileProps {
  category: CategoryRow;
  featured?: boolean;
}

export default function CategoryTile({ category, featured = false }: CategoryTileProps) {
  const categoryData = category as any;
  const imgSrc = categoryData.coverImage || category.cover_image || '';
  const businessCount = categoryData.businessCount ?? category.business_count ?? 0;
  return (
    <Link
      to={`/category/${category.slug}`}
      className={`category-tile group block rounded-lg overflow-hidden relative ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      } ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      )}
      {!imgSrc && (
        <div className="w-full h-full bg-surface-3" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent pointer-events-none" />

      <span className="absolute top-3 right-3 text-[10px] font-mono text-white/70 bg-brand-dark/40 px-2 py-0.5 rounded">
        {businessCount} listed
      </span>

      <h3 className="absolute bottom-4 left-4 font-playfair text-lg sm:text-xl font-semibold text-white z-10">
        {category.name}
      </h3>
    </Link>
  );
}
