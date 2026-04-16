'use server';

import QRCode from 'qrcode';

/**
 * Generate QR code as base64 data URL
 * Used for embedding in PDF tickets
 */
export async function generateQRCode(trackingUrl: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as raw buffer (for PDF)
 */
export async function generateQRCodeBuffer(trackingUrl: string): Promise<Buffer> {
  try {
    const qrBuffer = await QRCode.toBuffer(trackingUrl, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return qrBuffer;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}
