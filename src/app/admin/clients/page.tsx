import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getClients } from '@/lib/actions/clients';
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
import { format } from 'date-fns';

export default async function ClientsPage() {
  const t = await getTranslations('admin.clients');
  const clients = await getClients();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Link href="/admin/clients/new">
          <Button>{t('addButton')}</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('allClients')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableName')}</TableHead>
                <TableHead>{t('tableEmail')}</TableHead>
                <TableHead>{t('tablePhone')}</TableHead>
                <TableHead>{t('tableCreated')}</TableHead>
                <TableHead className="text-right">{t('tableActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('noClients')}
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell>
                      {client.createdAt ? format(new Date(client.createdAt), 'dd MMM yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button variant="outline" size="sm">
                            {t('tableEdit')}
                          </Button>
                        </Link>
                      </div>
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
