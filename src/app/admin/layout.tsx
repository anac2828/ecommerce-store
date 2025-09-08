import { Nav, NavLink } from '@/components/Nav';

// Force the page to be dynamic, since we are fetching data from the database. Data will not be cached.
export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href='/admin'>Dashboard</NavLink>
        <NavLink href='/admin/products'>Products</NavLink>
        <NavLink href='/admin/users'>Customers</NavLink>
        <NavLink href='/admin/orders'>Sales</NavLink>
      </Nav>
      {/* Children are the components from page.tsx  */}
      <div className='container m-6'>{children}</div>
    </>
  );
}
