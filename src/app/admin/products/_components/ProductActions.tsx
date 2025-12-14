'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTransition } from 'react'
import {
  deleteProduct,
  toggleProuctAvailability,
} from '../../_actions/products'
import { useRouter } from 'next/navigation'

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string
  isAvailableForPurchase: boolean
}) {
  // Hook for managing transition state when updating product availability
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Handler to toggle product availability
  const handleProductAvailability = () => {
    startTransition(async () => {
      // action that updates product availability in db
      await toggleProuctAvailability(id, !isAvailableForPurchase)
      router.refresh()
    })
  }

  return (
    <DropdownMenuItem onClick={handleProductAvailability} disabled={isPending}>
      {' '}
      {isAvailableForPurchase ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  )
}

// DELETE
export function DeleteDropdownMenu({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDeleteProduct = () => {
    startTransition(async () => {
      await deleteProduct(id)
      router.refresh()
    })
  }
  // disabled will keep the product from being deleted if it has orders
  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={disabled || isPending}
      onClick={handleDeleteProduct}
    >
      Delete
    </DropdownMenuItem>
  )
}
