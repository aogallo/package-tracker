import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { getOrders } from '@/lib/actions/orders';
import { getClientsForSelect } from '@/lib/actions/orders';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string; from?: string; to?: string }>;
}) {
  const t = await getTranslations('admin.orders');
  const locale = await getLocale();
  const params = await searchParams;

  const filters = {
    status: params.status,
    clientName: params.client,
    dateFrom: params.from ? new Date(params.from) : undefined,
    dateTo: params.to ? new Date(params.to) : undefined,
  };

  const [orders, clients] = await Promise.all([getOrders(filters), getClientsForSelect()]);

  // Create a map for quick client lookup
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  // Enrich orders with client names
  const enrichedOrders = orders.map((order) => ({
    ...order,
    displayName: order.clientId
      ? clientMap.get(order.clientId)?.name || order.guestName
      : t('guestPrefix', { name: order.guestName }),
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Link href="/admin/orders/new">
          <Button>{t('createButton')}</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('allOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableTrackingNumber')}</TableHead>
                <TableHead>{t('tableClient')}</TableHead>
                <TableHead>{t('tableType')}</TableHead>
                <TableHead>{t('tableStatus')}</TableHead>
                <TableHead>{t('tableDate')}</TableHead>
                <TableHead className="text-right">{t('tableActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t('noOrders')}
                  </TableCell>
                </TableRow>
              ) : (
                enrichedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.trackingNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.displayName}</span>
                        <span className="text-sm text-muted-foreground">{order.guestEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getDeliveryTypeLabel(locale, order.deliveryType)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {getStatusLabel(locale, order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          {t('tableView')}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
