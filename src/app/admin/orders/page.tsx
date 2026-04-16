import Link from 'next/link';
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

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  in_transit: 'bg-purple-500',
  delivered: 'bg-green-500',
  picked_up: 'bg-green-500',
  canceled: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_transit: 'En Camino',
  delivered: 'Entregado',
  picked_up: 'Recogido',
  canceled: 'Cancelado',
};

const deliveryTypeLabels: Record<string, string> = {
  delivery: 'Entrega',
  pickup: 'Recoger',
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string; from?: string; to?: string }>;
}) {
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
      : `Invitado: ${order.guestName}`,
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Órdenes</h1>
        <Link href="/admin/orders/new">
          <Button>Crear Orden</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Seguimiento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron órdenes.
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
                    <TableCell>
                      {deliveryTypeLabels[order.deliveryType] || order.deliveryType}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
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
