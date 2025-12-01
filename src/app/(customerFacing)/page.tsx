import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { Product } from '@/generated/prisma';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Suspense } from 'react';
import { cache } from '@/lib/cache';

// GET PRODUCTS FROM PRISMA DB - cache will get fetch data every 24 hours
const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: 'desc' } }, //sort by products with the most orders
      take: 6, //show only the first 6
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidated: 60 * 60 * 24 }
);

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' }, //sort by products with the most orders
    take: 6, //show only the first 6
  });
}, ['/', 'gerNewestProducts']);

// MAIN COMPONENT Displays on the layout.tsx
export default function HomePage() {
  return (
    <main className='space-y-8'>
      <ProductGridSection
        productsFetcher={getMostPopularProducts}
        title='Most Popular'
      />
      <ProductGridSection productsFetcher={getNewestProducts} title='Newest' />
    </main>
  );
}

// Sub components
type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className='space-y-4'>
      {/* SECTION TITLE */}
      <div className='flex gap-4'>
        <h2 className='text-3xl font-bold'>{title}</h2>
        <Button asChild variant='outline'>
          <Link href='/products' className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>

      {/* CARD */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {/* Suspense needed to use ProductCardSkeleton as a fallback */}
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          {/* await cannot be used here */}
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
