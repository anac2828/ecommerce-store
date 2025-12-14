import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import db from '@/db/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string
const resend = new Resend(process.env.RESEND_API_KEY as string)

// STRIPE WEBHOOK HANDLER
export async function POST(req: NextRequest) {
  // Verify the webhook signature and construct the event
  const event = await stripe.webhooks.constructEvent(
    await req.text(), //raw body
    req.headers.get('stripe-signature') as string,
    webhookSecret
  )

  // Check if the event type is 'charge.succeeded'
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const { productId } = charge.metadata
    const { email } = charge.billing_details
    const priceInCents = charge.amount

    //   Find product purchased in the database
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    //   No product or email found
    if (product == null || email == null)
      return new NextResponse('Bad request', { status: 400 })

    // Create or update the customer record in the database

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents: priceInCents } },
    }

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email }, //if user with email exists, update if not create
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } }, // Return the most recent order
    })

    //Create a download verification to email to the customer
    const downloadVerification = await db.downloadVerification.create({
      data: {
        productID: product.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Link expires in 24 hours
      },
    })

    // Send the email with Resend
    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `Your download link for ${product.name}`,
      react: <h1>Hi</h1>,
    })
  } //End of -- if charge.succeeded

  return new NextResponse('OK', { status: 200 })
}
