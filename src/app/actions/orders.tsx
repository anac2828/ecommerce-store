'use server'

import db from '@/db/db'

export default async function userOrderExists(
  email: string,
  productId: string
) {
  // Return order if it exists
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      //   return record showing only the id
      select: { id: true },
    })) != null
  )
}
