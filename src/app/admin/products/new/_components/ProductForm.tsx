'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { formatCurrency } from '@/lib/formaters';
import { addProduct } from '@/app/admin/_actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


export function ProductForm() {
  // Error handling
  const [error, action] = useActionState(addProduct, {});
  // use <number> instead of 0 to allow empty input field
  const [priceInCents, setPriceInCents] = useState<number>();
  
  return (
    <form action={action} className='space-y-7'>
      {/* Name */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' type='text' required />
        {error?.name && <div className='text-destructive'>{error.name}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price in cents</Label>
        <Input
          id='priceInCents'
          name='priceInCents'
          type='number'
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value))}
        />
      </div>
      <div className='text-muted-foreground'>
        {formatCurrency((priceInCents || 0) / 100)}
      </div>
        {error?.priceInCents && <div className='text-destructive'>{error.priceInCents}</div>}
    
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' name='description' required />
        {error?.description && <div className='text-destructive'>{error.description}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input id='file' name='file' type='file' required />
        {error?.file && <div className='text-destructive'>{error.file}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input id='image' name='image' type='file' required />
        {error?.image && <div className='text-destructive'>{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
