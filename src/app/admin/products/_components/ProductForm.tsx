'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { formatCurrency } from '@/lib/formaters'
import { addProduct, updateProduct } from '@/app/admin/_actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/generated/prisma'
import Image from 'next/image'

export function ProductForm({ product }: { product: Product | null }) {
  // Error handling
  const [error, action] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  )
  // use <number> instead of 0 to allow empty input field
  const [priceInCents, setPriceInCents] = useState('')

  console.log('ProductForm render', error)

  return (
    <form action={action} className='space-y-7'>
      {/* NAME */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          type='text'
          required
          defaultValue={product?.name}
        />
        {error?.name && <div className='text-destructive'>{error.name}</div>}
      </div>

      {/* PRICE */}
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price in cents</Label>
        <Input
          id='priceInCents'
          name='priceInCents'
          type='number'
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(e.target.value)}
        />
      </div>
      <div className='text-muted-foreground'>
        {formatCurrency(Number(priceInCents || 0) / 100)}
      </div>
      {error?.priceInCents && (
        <div className='text-destructive'>{error.priceInCents}</div>
      )}

      {/* DESCRIPTION */}
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          name='description'
          required
          defaultValue={product?.description}
        />
        {error?.description && (
          <div className='text-destructive'>{error.description}</div>
        )}
      </div>

      {/* FILE */}
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        {/* A file is required only if product is null */}
        <Input id='file' name='file' type='file' required={product == null} />
        {product != null && <div>{product.filePath}</div>}
        {error?.file && <div className='text-destructive'>{error.file}</div>}
      </div>

      {/* IMAGE */}
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input id='image' name='image' type='file' />
        {product != null && (
          <Image
            src={`${product.imagePath}`}
            width='400'
            height='400'
            alt='Product image'
          />
        )}
        {error?.image && <div className='text-destructive'>{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}
