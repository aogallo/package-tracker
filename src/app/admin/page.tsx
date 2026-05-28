import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { getOrders } from '@/lib/actions/orders';
import { getStats } from '@/lib/actions/stats';
// Inline label maps — replaced by import from @/lib/i18n/labels when PR #5 merges
const statusLabelMap: Record<string, { es: string; en: string }> = {
  pending: { es: 'Pendiente', en: 'Pending' },
  confirmed: { es: 'Confirmado', en: 'Confirmed' },
  in_transit: { es: 'En Camino', en: 'In Transit' },
  delivered: { es: 'Entregado', en: 'Delivered' },
  picked_up: { es: 'Recogido', en: 'Picked Up' },
  canceled: { es: 'Cancelado', en: 'Canceled' },
};

const deliveryTypeLabelMap: Record<string, { es: string; en: string }> = {
  delivery: { es: 'Entrega', en: 'Delivery' },
  pickup: { es: 'Recoger', en: 'Pickup' },
};

function getStatusLabel(locale: string, status: string): string {
  return statusLabelMap[status]?.[locale as 'es' | 'en'] || status;
}

function getDeliveryTypeLabel(locale: string, type: string): string {
  return deliveryTypeLabelMap[type]?.[locale as 'es' | 'en'] || type.toUpperCase();
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-900' },
  in_transit: { bg: 'bg-purple-100', text: 'text-purple-900' },
  delivered: { bg: 'bg-green-100', text: 'text-green-900' },
  picked_up: { bg: 'bg-green-100', text: 'text-green-900' },
  canceled: { bg: 'bg-red-100', text: 'text-red-900' },
};

export default async function AdminDashboard() {
  const t = await getTranslations('admin.dashboard');
  const locale = await getLocale();
  const dateLocale = locale === 'en' ? enUS : es;

  // Fetch data directly from server actions
  const [stats, orders] = await Promise.all([getStats(), getOrders({})]);

  // Get recent orders (sorted by createdAt desc, limit 5)
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 font-medium">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatsCard
          title={t('statTotal')}
          value={stats.total}
          description={t('statTotalDesc')}
          icon={Package}
          color="bg-slate-100 text-slate-700"
        />
        <StatsCard
          title={t('statPending')}
          value={stats.pending}
          description={t('statPendingDesc')}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          title={t('statInTransit')}
          value={stats.inTransit}
          description={t('statInTransitDesc')}
          icon={Truck}
          color="bg-purple-100 text-purple-700"
        />
        <StatsCard
          title={t('statDelivered')}
          value={stats.delivered}
          description={t('statDeliveredDesc')}
          icon={CheckCircle}
          color="bg-green-100 text-green-700"
        />
        <StatsCard
          title={t('statCanceled')}
          value={stats.canceled}
          description={t('statCanceledDesc')}
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{t('recentOrders')}</CardTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {t('recentOrdersDesc')}
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="font-semibold">
              {t('viewAll')}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground font-medium">
              {t('noOrders')}{' '}
              <Link href="/admin/orders/new" className="text-blue-600 hover:underline">
                {t('createFirst')}
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono font-bold text-lg bg-slate-100 px-3 py-1 rounded">
                      {order.trackingNumber}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {order.clientName || order.guestName || t('clientLabel')}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {getDeliveryTypeLabel(locale, order.deliveryType)} •{' '}
                        {order.createdAt
                          ? format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', {
                              locale: dateLocale,
                            })
                          : t('noDate')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                    >
                      {getStatusLabel(locale, order.status)}
                    </span>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="font-semibold">
                        {t('viewOrder')}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground font-medium mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
