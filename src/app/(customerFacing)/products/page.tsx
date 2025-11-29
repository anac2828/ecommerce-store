import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import db from '@/db/db';
import { Suspense } from 'react';

// GET PRODUCTS FROM Prisma

async function getProducts() {
  return await db.product.findMany({ where: { isAvailableForPurchase: true } });
}

// MAIN COMPONENT
export function ProductsPage() {
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
