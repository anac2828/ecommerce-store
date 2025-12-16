import db from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

// On stripe/purchase-succes page.tsx the user will how a download button the will redirect them to this route /download/downloadVerificationId
// Using the verifcation Id will retrieve the parth to the file purchased
export async function GET(
  req: NextRequest,
  { params }: { params: { downloadVerificationId: string } }
) {
  const { downloadVerificationId } = await params

  // Verification id comes from the download button on the purchase-success page
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  })

  // If no data is found or the link has expired redirect to expired page
  if (data == null) {
    return NextResponse.redirect(
      new URL('/products/download/expired', `${req.url}`)
    )
  }

  // TODO: Implement file download logic here using data.product.filePath

  // Get file size for headers (optional)
  const { size } = await fs.stat(data.product.filePath)
  const file = await fs.readFile(data.product.filePath)
  const extension = data.product.filePath.split('.').pop()

  return new NextResponse(Buffer.from(file), {
    headers: {
      'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
      // 'Content-Type': `application/${extension}`,
      'Content-Length': size.toString(),
    },
  })
}
