'use client';

import { useState, useCallback } from 'react';
import { getReportMetrics, getReportOrders, exportCSV } from '@/lib/actions/reports';
import { ReportFilters, FilterState } from '@/components/report-filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Package, Truck, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

type ReportMetrics = {
  total: number;
  pending: number;
  confirmed: number;
  in_transit: number;
  delivered: number;
  picked_up: number;
  canceled: number;
};

type ReportOrder = {
  id: number;
  trackingNumber: string;
  clientName: string | null;
  guestName: string;
  deliveryType: string;
  status: string;
  itemsCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type ClientOption = {
  id: number;
  name: string;
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  picked_up: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
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

interface ReportsClientProps {
  initialMetrics: ReportMetrics;
  initialOrders: ReportOrder[];
  clients: ClientOption[];
}

export default function ReportsClient({
  initialMetrics,
  initialOrders,
  clients,
}: ReportsClientProps) {
  const [metrics, setMetrics] = useState<ReportMetrics>(initialMetrics);
  const [orders, setOrders] = useState<ReportOrder[]>(initialOrders);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    clientId: 'all',
    status: 'all',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = useCallback(async (newFilters: FilterState) => {
    setIsLoading(true);
    try {
      // Build filters object
      const reportFilters: Record<string, unknown> = {};
      if (newFilters.dateFrom) {
        reportFilters.dateFrom = new Date(newFilters.dateFrom);
      }
      if (newFilters.dateTo) {
        reportFilters.dateTo = new Date(newFilters.dateTo);
      }
      if (newFilters.clientId && newFilters.clientId !== 'all') {
        reportFilters.clientId = parseInt(newFilters.clientId, 10);
      }
      if (newFilters.status && newFilters.status !== 'all') {
        reportFilters.status = newFilters.status;
      }

      // Fetch new data
      const [newMetrics, newOrders] = await Promise.all([
        getReportMetrics(reportFilters as Parameters<typeof getReportMetrics>[0]),
        getReportOrders(reportFilters as Parameters<typeof getReportOrders>[0]),
      ]);

      setMetrics(newMetrics);
      setOrders(newOrders);
      setFilters(newFilters);
    } catch (error) {
      console.error('Error al obtener informes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportCSV = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build filters object
      const reportFilters: Record<string, unknown> = {};
      if (filters.dateFrom) {
        reportFilters.dateFrom = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        reportFilters.dateTo = new Date(filters.dateTo);
      }
      if (filters.clientId && filters.clientId !== 'all') {
        reportFilters.clientId = parseInt(filters.clientId, 10);
      }
      if (filters.status && filters.status !== 'all') {
        reportFilters.status = filters.status;
      }

      const csvContent = await exportCSV(reportFilters as Parameters<typeof exportCSV>[0]);

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ordenes-export-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Informes</h1>
          <p className="text-muted-foreground">Ver estadísticas de órdenes y exportar datos</p>
        </div>
        <Button onClick={handleExportCSV} disabled={isLoading} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <ReportFilters clients={clients} onApply={handleApplyFilters} initialFilters={filters} />
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard
          title="Total"
          value={metrics.total}
          icon={Package}
          color="bg-slate-100 text-slate-700"
        />
        <MetricCard
          title="Pendientes"
          value={metrics.pending}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <MetricCard
          title="Confirmados"
          value={metrics.confirmed}
          icon={RotateCcw}
          color="bg-blue-100 text-blue-700"
        />
        <MetricCard
          title="En Camino"
          value={metrics.in_transit}
          icon={Truck}
          color="bg-purple-100 text-purple-700"
        />
        <MetricCard
          title="Entregados"
          value={metrics.delivered + metrics.picked_up}
          icon={CheckCircle}
          color="bg-green-100 text-green-700"
        />
        <MetricCard
          title="Cancelados"
          value={metrics.canceled}
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Filtradas ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron órdenes</p>
              <p className="text-sm text-muted-foreground mt-1">Intenta ajustar los filtros</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Seguimiento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead className="text-center">Artículos</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-mono">{order.trackingNumber}</TableCell>
                    <TableCell>{order.clientName || order.guestName}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {deliveryTypeLabels[order.deliveryType] || order.deliveryType}
                    </TableCell>
                    <TableCell className="text-center">{order.itemsCount}</TableCell>
                    <TableCell>
                      {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
