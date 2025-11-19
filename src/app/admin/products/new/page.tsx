import { PageHeader } from '../../_components/PageHeader';
import { ProductForm } from './_components/ProductForm';

// Page for adding a new product in the admin dashboard
export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
