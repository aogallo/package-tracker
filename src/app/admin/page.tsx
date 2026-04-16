'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_transit: 'En Camino',
  delivered: 'Entregado',
  picked_up: 'Recogido',
  canceled: 'Cancelado',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
  in_transit: { bg: 'bg-purple-100', text: 'text-purple-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  picked_up: { bg: 'bg-green-100', text: 'text-green-800' },
  canceled: { bg: 'bg-red-100', text: 'text-red-800' },
};

const deliveryTypeLabels: Record<string, string> = {
  delivery: 'Entrega',
  pickup: 'Recoger',
};

interface OrderStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  canceled: number;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  description: string | null;
  url: string | null;
}

interface Order {
  id: number;
  trackingNumber: string;
  status: string;
  deliveryType: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  clientId: number | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryZip: string | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  items?: OrderItem[];
  client?: {
    id: number;
    name: string;
  } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    canceled: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all orders and calculate stats
        const res = await fetch('/api/orders/list');
        if (res.ok) {
          const data = await res.json();
          const orders: Order[] = data.orders || [];

          // Calculate stats
          setStats({
            total: orders.length,
            pending: orders.filter((o) => o.status === 'pending').length,
            inTransit: orders.filter((o) => o.status === 'in_transit').length,
            delivered: orders.filter((o) => o.status === 'delivered').length,
            canceled: orders.filter((o) => o.status === 'canceled').length,
          });

          // Get recent orders (sorted by createdAt desc, limit 5)
          const sorted = [...orders]
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            })
            .slice(0, 5);

          setRecentOrders(sorted);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Resumen de tus órdenes y actividad reciente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatsCard
          title="Total"
          value={stats.total}
          description="Órdenes totales"
          icon={Package}
          color="bg-slate-100 text-slate-700"
        />
        <StatsCard
          title="Pendientes"
          value={stats.pending}
          description="Esperando confirmar"
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          title="En Camino"
          value={stats.inTransit}
          description="Siendo entregadas"
          icon={Truck}
          color="bg-purple-100 text-purple-700"
        />
        <StatsCard
          title="Entregadas"
          value={stats.delivered}
          description="Completadas"
          icon={CheckCircle}
          color="bg-green-100 text-green-700"
        />
        <StatsCard
          title="Canceladas"
          value={stats.canceled}
          description="Canceladas"
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Órdenes Recientes</CardTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Las últimas 5 órdenes creadas
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="font-semibold">
              Ver Todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground font-medium">
              Cargando órdenes...
            </p>
          ) : recentOrders.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground font-medium">
              No hay órdenes recientes.{' '}
              <Link href="/admin/orders/new" className="text-blue-600 hover:underline">
                Crear primera orden
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
                        {order.client?.name || order.guestName || 'Cliente'}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {deliveryTypeLabels[order.deliveryType] || order.deliveryType} •{' '}
                        {order.createdAt
                          ? format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })
                          : 'Sin fecha'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="font-semibold">
                        Ver
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
