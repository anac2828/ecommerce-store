'use server'

import db from '@/db/db'
import OrderHistoryEmail from '@/email/OrderHistory'
import { Resend } from 'resend'
import { z } from 'zod'

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get('email'))

  if (result.success === false) {
    return { error: 'Invalid email address' }
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  })

  // No user found with that email but we don't want to reveal that information. So just send a generic message.
  if (user == null) {
    return {
      message:
        'Check your email to view your order history and download your products.',
    }
  }

  // Order list to be emailed to the user
  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60), // 24 hours from now
            productID: order.product.id,
          },
        })
      ).id,
    }
  })

  const data = await resend.emails.send({
    from: `Supoort <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Order History',
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  })

  if (data.error) return { error: 'Failed to send email. Please try again.' }

  return {
    message:
      'Check your email to view your order history and download your products.',
  }
}
