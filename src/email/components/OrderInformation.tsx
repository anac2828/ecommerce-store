import { formatCurrency, formatDate } from '@/lib/formaters'
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components'

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  product: { imagePath: string; name: string; description: string }
  downloadVerificationId: string
}

export default function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>
              ORDER ID
            </Text>
            <Text className='mt-0 mr-4'>{order.id}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>
              Purchased On
            </Text>
            <Text className='mt-0 mr-4'>{formatDate(order.createdAt)}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>
              Price Paid
            </Text>
            <Text className='mt-0 mr-4'>
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className='p-4 my-4 border border-gray-500 border-solid rounded-lg md:p-6'>
        <Img width='100%' alt={product.name} src={product.imagePath} />
        <Row className='mt-8'>
          <Column className='align-bottom'>
            <Text className='m-0 mr-4 text-lg font-bold'>{product.name}</Text>
          </Column>
          <Column align='right'>
            <Button
              href={`http://localhost:3000/products/download/${downloadVerificationId}`}
              className='px-6 py-4 text-lg text-white bg-black rounded'
            >
              Download
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500'>{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}
