import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components'
import OrderInformation from './components/OrderInformation'

type OrderHistoryEmailProps = {
  orders: {
    id: string
    pricePaidInCents: number
    createdAt: Date
    downloadVerificationId: string
    product: {
      name: string
      imagePath: string
      description: string
    }
  }[]
}

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 1999,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: 'Sample Product',
        imagePath: 'http://localhost:3001/static/shoes.jpg',
        description: 'This is a sample product description.',
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 3000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: 'Sample Product 2',
        imagePath: 'http://localhost:3001/static/lotions.jpeg',
        description: 'This is a sample product description.',
      },
    },
  ],
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <>
                <OrderInformation
                  key={order.id}
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
