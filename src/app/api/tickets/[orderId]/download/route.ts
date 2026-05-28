import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateTicket } from '@/lib/services/pdf.service';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;
    const orderIdNum = parseInt(orderId, 10);

    if (isNaN(orderIdNum)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Read locale from cookie (NEXT_LOCALE set by next-intl middleware)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';

    // Get order to get tracking number for filename
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderIdNum),
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate PDF
    const result = await generateTicket(orderIdNum, locale);

    if (!result.success || !result.pdfBuffer) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate PDF' },
        { status: 500 }
      );
    }

    // Convert Buffer to Uint8Array for NextResponse
    const pdfUint8Array = new Uint8Array(result.pdfBuffer);

    // Return PDF with proper headers
    return new NextResponse(pdfUint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${order.trackingNumber}.pdf"`,
        'Content-Length': pdfUint8Array.length.toString(),
      },
    });
  } catch (error) {
    console.error('Ticket download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
