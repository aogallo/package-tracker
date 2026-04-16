import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/actions/orders';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const formData = await request.formData();
    const status = formData.get('status') as string;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = [
      'pending',
      'confirmed',
      'in_transit',
      'delivered',
      'picked_up',
      'canceled',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await updateOrderStatus(
      orderId,
      status as 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'picked_up' | 'canceled'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
