import { redirect } from 'next/navigation';
import { getClientsForSelect, createOrder } from '@/lib/actions/orders';
import { auth } from '@/lib/auth';
import { OrderForm } from '@/components/order-form';

export default async function NewOrderPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const clients = await getClientsForSelect();

  async function handleCreate(formData: FormData) {
    'use server';

    const clientId = formData.get('clientId');
    const itemsStr = formData.get('items') as string;
    const items = JSON.parse(itemsStr);

    // Validate: either client OR guest info
    if (!clientId || clientId === 'guest') {
      const guestName = formData.get('guestName') as string;
      const guestEmail = formData.get('guestEmail') as string;

      if (!guestName || !guestEmail) {
        throw new Error('Guest name and email are required');
      }

      await createOrder({
        guestName,
        guestEmail,
        guestPhone: formData.get('guestPhone') as string | undefined,
        deliveryType: formData.get('deliveryType') as 'delivery' | 'pickup',
        deliveryAddress: formData.get('deliveryAddress') as string | undefined,
        deliveryCity: formData.get('deliveryCity') as string | undefined,
        deliveryZip: formData.get('deliveryZip') as string | undefined,
        notes: formData.get('notes') as string | undefined,
        items: items.filter((item: { name: string }) => item.name.trim() !== ''),
      });
    } else {
      // Get client info from the select
      const selectedClient = clients.find((c) => c.id === parseInt(clientId as string));

      await createOrder({
        clientId: parseInt(clientId as string),
        guestName: selectedClient?.name || '',
        guestEmail: selectedClient?.email || '',
        deliveryType: formData.get('deliveryType') as 'delivery' | 'pickup',
        deliveryAddress: formData.get('deliveryAddress') as string | undefined,
        deliveryCity: formData.get('deliveryCity') as string | undefined,
        deliveryZip: formData.get('deliveryZip') as string | undefined,
        notes: formData.get('notes') as string | undefined,
        items: items.filter((item: { name: string }) => item.name.trim() !== ''),
      });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <OrderForm clients={clients} action={handleCreate} />
    </div>
  );
}
