import db from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckoutForm } from './_components/CheckoutForm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  const product = await db.product.findUnique({ where: { id } })
  if (product == null) return notFound()

  // * STRIPE PAYMENT INTENT
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'USD',
    metadata: { productId: product.id },
  })

  // * ERROR HANDLER
  if (paymentIntent.client_secret == null) {
    throw new Error('Stripe failed to create payment intent')
  }

  // CheckoutForm will display the information of the product and credit card info to be submitted to STRIPE
  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  )
}
