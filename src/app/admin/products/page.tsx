import Link from 'next/link';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import db from '@/db/db';
import { formatNumber } from '@/lib/formaters';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../_components/PageHeader';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ActiveToggleDropdownItem, DeleteDropdownMenu } from './_components/ProductActions';

// List of products for the admin/products page
export default function AdminProductPage() {
  return (
    <>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Products</PageHeader>
        {/* asChild  renders button as an <a> tag and maintains the button styles*/}
        <Button asChild>
          <Link href='/admin/products/new'>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      // Number of orders for the product
      _count: {
        select: { orders: true }
      }
    }
  })

  if (products.length === 0) return <p>No products found.</p>

  return (
    <Table>
      {/* HEADER */}
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product =>
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ?
                <>
                  <span className='sr-only'>Available</span>
                  <CheckCircle2 />
                </> :
                <>
                  <span className='sr-only'>Unavailable</span>
                  <XCircle className='stroke-destructive' />
                </>}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.priceInCents / 100}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                {/* Button */}
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>

                {/* Content */}
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`}>Download</a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Actions */}
                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                  <DropdownMenuSeparator />

                  <DeleteDropdownMenu id={product.id} disabled={product._count.orders > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
