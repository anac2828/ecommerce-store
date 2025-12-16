'use server'

import crypto from 'crypto'
import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import fs from 'fs/promises'
import db from '@/db/db'
import { revalidatePath } from 'next/cache'

// FORM VALIDATION SCHEMA
const fileSchema = z.instanceof(File, { message: 'Required' })

// const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
//   message: 'File is required',
// });

// Image should be of type image/* and size 0 (no file uploaded)
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/'),
  'Please upload an image file'
)
// const imageSchema = fileSchema.refine(
//   (file) => file.size === 0 || file.type.startsWith('image/')
// );

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1), //To keep from items being free.
  file: fileSchema.refine(
    (file) => file.size <= 500_000,
    'File size must be less than 500KB'
  ),
  image: imageSchema.refine(
    (file) => file.size <= 500_000,
    'Image size must be less than 500KB'
  ),
})
// const addSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().min(1),
//   priceInCents: z.coerce.number().int().min(1), //To keep from items being free.
//   file: fileSchema,
//   image: imageSchema,
// });

//** */ ADD PRODUCT
// prevState is required for using the error handling in the form prevState: unknown
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))

  // error handler
  if (result.success === false) {
    console.log('ZOD ERROR', result.error)
    // ZOD V4
    // return z.flattenError(result.error).fieldErrors;
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  // From the form submition
  console.log('FORM DATA', data)
  // Saves to the public folder for simplicity
  // In a real app, you'd upload the files to a storage service here
  await fs.mkdir('products', { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir('public/products', { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      // In a real app, you'd upload the files to a storage service here
      filePath,
      imagePath,
    },
  })

  //If the data changes @/libs/cache will clear the cache and get the new data
  revalidatePath('/')
  revalidatePath('/products')

  redirect('/admin/products')
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

//** */ EDIT PRODUCT
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))

  if (result.success === false) {
    // ZOD v4
    // return z.flattenError(result.error).fieldErrors;
    return result.error.formErrors.fieldErrors
  }
  // From form submition

  const data = result.data

  const product = await db.product.findUnique({ where: { id } })

  if (product == null) return notFound()

  // current file saved to db
  let filePath = product.filePath

  // If there was a file uploaded
  if (data.file != null && data.file.size > 0) {
    // delete file
    await fs.unlink(filePath)
    // New file path
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    // Save file
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  // Current file saved to db
  let imagePath = product.imagePath

  if (data.image != null && data.image.size > 0) {
    // Delete file
    await fs.unlink(`public${imagePath}`)
    // New image
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    // Save new image
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      // In a real app, you'd upload the files to a storage service here
      filePath,
      imagePath,
    },
  })

  revalidatePath('/')
  revalidatePath('/products')
  redirect('/admin/products')
}

//** */ TOGGLE AVAILABILITY

// Toggle product availability action from true to false or viseversa
// Used in the product table dropdown menu
export async function toggleProuctAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  })
  revalidatePath('/')
  revalidatePath('/products')
}

//** */ Prisma DELETE action
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })

  if (product == null) return notFound()

  // Deletes files upon product deletion
  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)

  revalidatePath('/')
  revalidatePath('/products')
}
