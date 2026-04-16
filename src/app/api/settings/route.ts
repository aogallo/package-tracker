import { NextResponse } from 'next/server';
import { getCompanyName, setSetting } from '@/lib/actions/settings';

export async function GET() {
  try {
    const companyName = await getCompanyName();
    return NextResponse.json({ companyName });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyName } = body;

    if (typeof companyName !== 'string') {
      return NextResponse.json({ error: 'Invalid companyName' }, { status: 400 });
    }

    await setSetting('company_name', companyName.trim());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
