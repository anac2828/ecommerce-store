'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import { emailOrderHistory } from '@/actions/orders'
import { useActionState } from 'react'

export default function MyOrdersPage() {
  const [data, action] = useActionState(emailOrderHistory, {})

  console.log('action state data:', data)

  return (
    <form className='mx-auto max-2-xl' action={action}>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your e-mail and we will e-mail you your order histoy and
            download links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' required name='email' id='email' />
          </div>
          {data.error && (
            <div className='mt-2 text-destructive'>{data.error}</div>
          )}
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className='w-full' size='lg' disabled={pending} type='submit'>
      {pending ? 'Sending...' : 'Send Email'}
    </Button>
  )
}
