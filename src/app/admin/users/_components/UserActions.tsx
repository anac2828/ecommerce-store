'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deleteUser } from '../../_actions/users'

export function DeleteDropDownItem({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleOnDelete = () => {
    startTransition(async () => {
      await deleteUser(userId)
      router.refresh()
    })
  }

  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={isPending}
      onClick={handleOnDelete}
    >
      Delete
    </DropdownMenuItem>
  )
}
