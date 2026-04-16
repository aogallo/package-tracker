'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ClientFormProps {
  initialData?: {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  action: (data: FormData) => Promise<void>;
}

export function ClientForm({ initialData, action }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await action(formData);
      toast.success(initialData ? 'Cliente actualizado' : 'Cliente creado');
      router.push('/admin/clients');
      router.refresh();
    } catch (error) {
      toast.error('Error al guardar cliente');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Cliente' : 'Nuevo Cliente'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialData?.name}
              placeholder="Ingrese nombre del cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialData?.email}
              placeholder="cliente@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialData?.phone}
              placeholder="+502 1234-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              type="text"
              defaultValue={initialData?.address}
              placeholder="123 Calle Principal, Zona 1"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/clients')}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
