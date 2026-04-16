import { getReportMetrics, getReportOrders, getClientsForReport } from '@/lib/actions/reports';
import ReportsClient from './reports-client';

export default async function ReportsPage() {
  // Fetch initial data on the server
  const [metrics, orders, clients] = await Promise.all([
    getReportMetrics(),
    getReportOrders(),
    getClientsForReport(),
  ]);

  return <ReportsClient initialMetrics={metrics} initialOrders={orders} clients={clients} />;
}
