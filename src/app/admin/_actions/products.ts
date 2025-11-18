'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import fs from 'fs/promises';
import db from '@/db/db';

// FORM VALIDATION SCHEMA
const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
  message: 'File is required',
});

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/')
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1), //To keep from items being free.
  file: fileSchema,
  image: imageSchema,
});

// prevState is required for using the error handling in the form
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.issues;
  }
  const data = result.data;

  // Saves to the public folder for simplicity
  // In a real app, you'd upload the files to a storage service here
  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      // In a real app, you'd upload the files to a storage service here
      filePath,
      imagePath,
    },
  });

  redirect('/admin/products');
}
