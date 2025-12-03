import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { formatCurrency } from '@/lib/formaters'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// * MAIN COMPONENT *****
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {
  const { payment_intent: paymentIntentId } = await searchParams
  // * RETRIEVE PAYMENT INTENT
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.metadata.productId == null) return notFound()

  // * GET PRODUCT
  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  })

  if (product == null) return notFound()

  // * PAYMENT SUCCESS
  const isSuccess = paymentIntent.status === 'succeeded'

  return (
    <div className='w-full max-w-5xl mx-auto space-y-8'>
      <h1 className='text-4xl font-bold'>
        {isSuccess ? 'Success!' : 'Error!'}
      </h1>
      {/* PRODUCT INFO */}
      <div className='flex items-center gap-4'>
        <div className='relative w-1/3 shrink-0 aspect-video'>
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className='object-cover'
          />
        </div>
        <div>
          <div className='text-lg'>
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-forground'>
            {product.description}
          </div>
          <Button className='mt-4' size='lg' asChild>
            {isSuccess ? (
              // Route to download file
              <a
                href={`/products/download/${await createDownloadVerificationId(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Creates a verification id the database and returns it for use in the button link. Verification ID expires in 24 hours.
async function createDownloadVerificationId(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productID: productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id
}
