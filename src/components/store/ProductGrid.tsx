import React from 'react';
import { Product } from '../../data/store';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center max-w-lg mx-auto w-full">
        <div className="w-12 h-12 rounded-xl bg-neutral-200/50 flex items-center justify-center text-neutral-400 mb-4">
          <PackageOpen className="w-6 h-6" />
        </div>
        <h3 className="text-[#0F172A] font-sans font-bold text-base">Aucun modèle trouvé</h3>
        <p className="text-neutral-500 text-xs mt-1 leading-relaxed max-w-sm">
          Nous n'avons trouvé aucun modèle correspondant à vos critères de recherche actuels. Veuillez essayer de modifier ou réinitialiser vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
