'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formaters';
import { useState } from 'react';

export function ProductForm() {
  // use <number> instead of 0 to allow empty input field
  const [priceInCents, setPriceInCents] = useState<number>();
  return (
    <form className='space-y-7'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' type='text' required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price in cents</Label>
        <Input
          id='priceInCents'
          name='priceInCents'
          type='number'
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
      </div>
      <div className='text-muted-foreground'>
        {formatCurrency((priceInCents || 0) / 100)}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' name='description' required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input id='file' name='file' type='file' required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input id='image' name='image' type='file' required />
      </div>
      <Button type='submit'>Save</Button>
    </form>
  );
}
