import React from 'react';
import { Product } from '../../data/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = `#/store/${product.slug}`;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleNavigate}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Color Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-[#0F172A]/80 backdrop-blur-md text-[10px] font-mono font-semibold text-white px-2.5 py-1 rounded-full border border-white/10">
            {product.color}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1">
            {product.wear_category}
          </span>
          <h3 className="text-[#0F172A] font-sans font-bold text-sm line-clamp-2 leading-snug group-hover:text-[#3B82F6] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center justify-between gap-2">
          {/* Price with DH / MAD */}
          <div className="flex flex-col">
            <span className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider">Tarif Professionnel</span>
            <span className="text-[#0F172A] font-sans font-extrabold text-base">
              {product.price} <span className="text-xs font-semibold">DH</span>
            </span>
          </div>

          {/* Action Button: "Voir le produit" */}
          <button
            onClick={handleNavigate}
            className="px-3.5 py-2 text-[11px] font-sans font-bold uppercase tracking-wider text-[#3B82F6] border border-[#3B82F6]/30 hover:border-[#3B82F6] rounded-lg bg-white hover:bg-neutral-50 transition-all duration-200"
          >
            Voir le produit
          </button>
        </div>
      </div>
    </div>
  );
}
