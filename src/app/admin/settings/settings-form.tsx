'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateSettings } from '@/lib/actions/settings';

interface SettingsFormProps {
  initialCompanyName: string;
}

export default function SettingsForm({ initialCompanyName }: SettingsFormProps) {
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ companyName });
      if (result.success) {
        toast.success('Configuración guardada');
        router.refresh(); // Refresh server components
      } else {
        toast.error('Error al guardar');
      }
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Input
        id="companyName"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Mi Empresa de Paquetes"
        className="mt-1"
      />
      <Button onClick={handleSave} disabled={saving} className="font-semibold mt-4">
        {saving ? 'Guardando...' : 'Guardar Configuración'}
      </Button>
    </>
  );
}
