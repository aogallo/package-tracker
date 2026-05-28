import { notFound } from 'next/navigation';
import { trackOrder, getStatusDisplayInfo } from '@/lib/actions/tracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Truck, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { getTranslations, getFormatter, getLocale } from 'next-intl/server';
import Link from 'next/link';

interface TrackPageProps {
  params: Promise<{ trackingNumber: string }>;
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { trackingNumber } = await params;
  const t = await getTranslations('track');
  return {
    title: t('resultTitle', { trackingNumber }),
    description: t('resultMetaDescription'),
    openGraph: {
      title: t('resultTitle', { trackingNumber }),
      description: t('resultMetaDescription'),
      type: 'website',
    },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackingNumber } = await params;
  const t = await getTranslations('track');
  const formatter = await getFormatter();
  const locale = await getLocale();

  const order = await trackOrder(trackingNumber);

  if (!order) {
    notFound();
  }

  const statusInfo = await getStatusDisplayInfo(order.status, locale);

  // Get timeline events based on status
  const timelineEvents = [
    {
      label: t('eventOrderCreated'),
      date: order.createdAt,
      completed: true,
      icon: Package,
    },
    {
      label: t('eventConfirmed'),
      date: order.status !== 'pending' ? order.updatedAt : null,
      completed: ['confirmed', 'in_transit', 'delivered', 'picked_up'].includes(order.status),
      icon: CheckCircle,
    },
    {
      label: order.deliveryType === 'delivery' ? t('eventInTransit') : t('eventReadyPickup'),
      date: ['in_transit', 'delivered', 'picked_up'].includes(order.status)
        ? order.updatedAt
        : null,
      completed: ['in_transit', 'delivered', 'picked_up'].includes(order.status),
      icon: Truck,
    },
    {
      label: order.deliveryType === 'delivery' ? t('eventDelivered') : t('eventPickedUp'),
      date: ['delivered', 'picked_up'].includes(order.status) ? order.deliveredAt : null,
      completed: ['delivered', 'picked_up'].includes(order.status),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/track"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backLink')}
        </Link>

        {/* Header Card */}
        <Card className="mb-6 border-t-4 border-t-blue-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{t('trackingCardTitle')}</CardTitle>
                <p className="text-muted-foreground mt-1">
                  {t('trackingNumber', { trackingNumber: order.trackingNumber })}
                </p>
              </div>
              <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>{statusInfo.label}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{statusInfo.description}</p>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('timelineTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${event.completed ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <event.icon
                      className={`w-4 h-4 ${event.completed ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {event.label}
                    </p>
                    {event.date && (
                      <p className="text-sm text-muted-foreground">
                        {formatter.dateTime(new Date(event.date), {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </p>
                    )}
                    {!event.date && order.status === 'canceled' && (
                      <p className="text-sm text-red-500">{t('eventCanceledNotice')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              {t('detailsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  {t('deliveryTypeLabel')}
                </Label>
                <p className="font-medium">
                  {order.deliveryType === 'delivery'
                    ? t('deliveryTypeHome')
                    : t('deliveryTypeStore')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  {t('orderDateLabel')}
                </Label>
                <p className="font-medium">
                  {order.createdAt
                    ? formatter.dateTime(new Date(order.createdAt), { dateStyle: 'long' })
                    : t('na')}
                </p>
              </div>
            </div>

            <Label className="text-muted-foreground text-sm font-medium mb-2 block">
              {t('itemsLabel')}
            </Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableItem')}</TableHead>
                  <TableHead className="text-center">{t('tableQty')}</TableHead>
                  <TableHead>{t('tableDescription')}</TableHead>
                  <TableHead>{t('tableUrl')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {t('viewLink')}
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {t('noItems')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">{t('helpTitle')}</p>
                <p className="text-sm text-blue-700 mt-1">{t('helpCardBody')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
