import { createClient } from '@/lib/actions/clients';
import { ClientForm } from '@/components/client-form';

export default function NewClientPage() {
  async function handleCreate(formData: FormData) {
    'use server';

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | undefined,
      address: formData.get('address') as string | undefined,
    };

    await createClient(data);
  }

  return (
    <div className="container mx-auto py-10">
      <ClientForm action={handleCreate} />
    </div>
  );
}
