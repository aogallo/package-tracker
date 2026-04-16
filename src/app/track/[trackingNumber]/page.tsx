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
import { format } from 'date-fns';
import Link from 'next/link';

interface TrackPageProps {
  params: Promise<{ trackingNumber: string }>;
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { trackingNumber } = await params;
  return {
    title: `Rastrear Paquete ${trackingNumber} | Tracker`,
    description: 'Rastrea el estado de entrega de tu paquete',
    openGraph: {
      title: `Rastrear Paquete ${trackingNumber} | Tracker`,
      description: 'Rastrea el estado de entrega de tu paquete',
      type: 'website',
    },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackingNumber } = await params;

  const order = await trackOrder(trackingNumber);

  if (!order) {
    notFound();
  }

  const statusInfo = await getStatusDisplayInfo(order.status);

  // Get timeline events based on status
  const timelineEvents = [
    {
      label: 'Orden Creada',
      date: order.createdAt,
      completed: true,
      icon: Package,
    },
    {
      label: 'Confirmado',
      date: order.status !== 'pending' ? order.updatedAt : null,
      completed: ['confirmed', 'in_transit', 'delivered', 'picked_up'].includes(order.status),
      icon: CheckCircle,
    },
    {
      label: order.deliveryType === 'delivery' ? 'En Camino' : 'Listo para Recoger',
      date: ['in_transit', 'delivered', 'picked_up'].includes(order.status)
        ? order.updatedAt
        : null,
      completed: ['in_transit', 'delivered', 'picked_up'].includes(order.status),
      icon: Truck,
    },
    {
      label: order.deliveryType === 'delivery' ? 'Entregado' : 'Recogido',
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
          Volver al rastreo
        </Link>

        {/* Header Card */}
        <Card className="mb-6 border-t-4 border-t-blue-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Rastrea Tu Paquete</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Número de Seguimiento: {order.trackingNumber}
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
              Línea de Tiempo de Entrega
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
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy, HH:mm")}
                      </p>
                    )}
                    {!event.date && order.status === 'canceled' && (
                      <p className="text-sm text-red-500">Esta orden fue cancelada</p>
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
              Detalles de la Orden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">Tipo de Entrega</Label>
                <p className="font-medium">
                  {order.deliveryType === 'delivery' ? 'Entrega a Domicilio' : 'Recoger en Tienda'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">Fecha de Orden</Label>
                <p className="font-medium">
                  {order.createdAt
                    ? format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy")
                    : 'N/A'}
                </p>
              </div>
            </div>

            <Label className="text-muted-foreground text-sm font-medium mb-2 block">
              Artículos
            </Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artículo</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>URL</TableHead>
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
                            Ver
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
                      Sin artículos
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
                <p className="font-medium text-blue-900">¿Necesitas Ayuda?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Si tienes preguntas sobre tu orden, por favor contacta a nuestro equipo de soporte
                  con tu número de seguimiento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
