import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getClientById, updateClient, deleteClient } from '@/lib/actions/clients';
import { ClientForm } from '@/components/client-form';
import { Button } from '@/components/ui/button';

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const t = await getTranslations('admin.clients');
  const { id } = await params;
  const clientId = parseInt(id, 10);

  if (isNaN(clientId)) {
    notFound();
  }

  const client = await getClientById(clientId);

  if (!client) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    'use server';

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | undefined,
      address: formData.get('address') as string | undefined,
    };

    await updateClient(clientId, data);
  }

  async function handleDelete() {
    'use server';
    await deleteClient(clientId);
    redirect('/admin/clients');
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <ClientForm
          initialData={{
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone || undefined,
            address: client.address || undefined,
          }}
          action={handleUpdate}
        />

        <div className="mt-6 pt-6 border-t">
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              {t('deleteButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
