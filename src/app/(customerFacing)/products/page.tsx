import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import db from '@/db/db';
import { cache } from '@/lib/cache';
import { Suspense } from 'react';

// GET PRODUCTS FROM Prisma
const getProducts = cache(async () => {
  return await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: 'asc' },
  });
}, ['/', 'getProducts']);

// MAIN COMPONENT
export default function ProductsPage() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  );
}

async function ProductsSuspense() {
  const products = await getProducts();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
