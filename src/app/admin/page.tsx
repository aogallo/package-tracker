import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  const adminName = session?.user?.name || 'Administrador';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {adminName}</h1>
        <p className="text-muted-foreground mt-1">Aquí está el resumen de tus órdenes hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Órdenes Hoy"
          value="12"
          description="+2 respecto a ayer"
          icon={Package}
          trend="up"
        />
        <StatsCard
          title="Pendientes"
          value="8"
          description="Esperando confirmación"
          icon={Clock}
          trend="neutral"
        />
        <StatsCard
          title="En Camino"
          value="15"
          description="Entregando actualmente"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Entregados"
          value="156"
          description="Este mes"
          icon={CheckCircle}
          trend="up"
        />
      </div>

      {/* Recent Orders Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Recientes</CardTitle>
          <CardDescription>Las últimas órdenes de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay órdenes recientes para mostrar.
            </p>
          </div>
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
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColors[trend]}`}>{description}</p>
      </CardContent>
    </Card>
  );
}
