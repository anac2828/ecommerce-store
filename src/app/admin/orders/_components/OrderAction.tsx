'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deleteOrder } from '../../_actions/orders'

export function DeleteOrderDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleOnDeleteOrder = () => {
    startTransition(async () => {
      await deleteOrder(id)
      router.refresh()
    })
  }

  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={isPending}
      onClick={handleOnDeleteOrder}
    >
      Delete
    </DropdownMenuItem>
  )
}
