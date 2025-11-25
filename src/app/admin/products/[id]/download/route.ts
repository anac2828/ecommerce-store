import db from "@/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params, }: { params: { id: string } }) {

    const { id } = await params;
    console.log("ID", id)
    // ID comes from the Download button in the products page
    const product = await db.product.findUnique(
        {
            where: { id },
            select: { filePath: true, name: true }
        })

    if (product == null) return notFound()
    // Get file info
    const { size } = await fs.stat(product.filePath)
    // Read file
    const file = await fs.readFile(product.filePath)
    // Change to readable buffer to avoid error: Buffer<ArrayBufferLike> as a body in a fetch request, which is not compatible with the expected BodyInit types. 
    const fileBuffer = Buffer.from(file)
    const fileForDownload = fileBuffer.buffer

    // Get file extension by spliting file string at the dot which will return an array and .pop() will return the last item in the array.
    const extension = product.filePath.split('.').pop()

    return new NextResponse(fileForDownload, {
        headers: {
            // File name when it is being downloaded
            "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
            // File size to calculate download time
            "Content-Length": size.toString()
        }
    })
}