import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { getOrderById } from '@/lib/actions/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { StatusUpdateForm } from '@/components/status-update-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { getStatusLabel, getDeliveryTypeLabel } from '@/lib/i18n/labels';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  in_transit: 'bg-purple-500',
  delivered: 'bg-green-500',
  picked_up: 'bg-green-500',
  canceled: 'bg-red-500',
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const t = await getTranslations('admin.orders');
  const locale = await getLocale();
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('detail.title', { trackingNumber: order.trackingNumber })}
          </h1>
          <p className="text-muted-foreground">
            {t('detail.createdOn', {
              date: order.createdAt
                ? format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy")
                : 'N/A',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/api/tickets/${order.id}/download`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('detail.downloadTicket')}
          </a>
          <Badge className={`${statusColors[order.status]} text-white`}>
            {getStatusLabel(locale, order.status)}
          </Badge>
        </div>
      </div>

      {/* Status Update */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('detail.updateStatus')}</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusUpdateForm orderId={orderId} currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('detail.customerInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">{t('detail.customerName')}</Label>
              <p className="font-medium">{order.guestName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">{t('detail.customerEmail')}</Label>
              <p className="font-medium">{order.guestEmail}</p>
            </div>
            {order.guestPhone && (
              <div>
                <Label className="text-muted-foreground">{t('detail.customerPhone')}</Label>
                <p className="font-medium">{order.guestPhone}</p>
              </div>
            )}
            {order.clientId && (
              <div>
                <Label className="text-muted-foreground">{t('detail.customerRegistered')}</Label>
                <p className="font-medium">{t('detail.customerRegistered')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('detail.deliveryInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">{t('detail.deliveryType')}</Label>
              <p className="font-medium">{getDeliveryTypeLabel(locale, order.deliveryType)}</p>
            </div>
            {order.deliveryType === 'delivery' && order.deliveryAddress && (
              <>
                <div>
                  <Label className="text-muted-foreground">{t('detail.deliveryAddress')}</Label>
                  <p className="font-medium">{order.deliveryAddress}</p>
                </div>
                {order.deliveryCity && (
                  <div>
                    <Label className="text-muted-foreground">{t('detail.deliveryCity')}</Label>
                    <p className="font-medium">{order.deliveryCity}</p>
                  </div>
                )}
                {order.deliveryZip && (
                  <div>
                    <Label className="text-muted-foreground">{t('detail.deliveryZip')}</Label>
                    <p className="font-medium">{order.deliveryZip}</p>
                  </div>
                )}
              </>
            )}
            {order.notes && (
              <div className="col-span-2">
                <Label className="text-muted-foreground">{t('detail.notes')}</Label>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('detail.itemsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('detail.tableItem')}</TableHead>
                <TableHead>{t('detail.tableQty')}</TableHead>
                <TableHead>{t('detail.tableDescription')}</TableHead>
                <TableHead>{t('detail.tableUrl')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {t('detail.viewLink')}
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
                    {t('detail.noItems')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
