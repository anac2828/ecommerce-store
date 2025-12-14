import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components'
import OrderInformation from './components/OrderInformation'

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
  }
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: 'Sample Product',
    imagePath: 'http://localhost:3001/static/shoes.jpg',
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 1999,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>{product.name} Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
