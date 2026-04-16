'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_transit: 'En Camino',
  delivered: 'Entregado',
  picked_up: 'Recogido',
  canceled: 'Cancelado',
};

interface StatusUpdateFormProps {
  orderId: number;
  currentStatus: string;
}

export function StatusUpdateForm({ orderId, currentStatus }: StatusUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Error al actualizar' }));
        throw new Error(error.error || 'Error al actualizar');
      }

      toast.success('Estado actualizado correctamente');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Select value={status} onValueChange={(value) => setStatus(value || currentStatus)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? 'Guardando...' : 'Actualizar'}
      </Button>
    </form>
  );
}
