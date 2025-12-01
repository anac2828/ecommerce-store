import { Nav, NavLink } from '@/components/Nav';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href='/'>Home</NavLink>
        <NavLink href='/products'>Products</NavLink>
        <NavLink href='/orders'>My Orders</NavLink>
      </Nav>
      <div className='container px-6 my-6'>{children}</div>
    </>
  );
}
