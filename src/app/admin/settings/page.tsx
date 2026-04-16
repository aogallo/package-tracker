'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.companyName || '');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });
      if (res.ok) {
        toast.success('Configuración guardada');
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
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Administra la configuración de tu aplicación
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Información de la Empresa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="font-semibold">
              Nombre de la Empresa
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Mi Empresa de Paquetes"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Este nombre aparecerá en los tickets PDF generados.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="font-semibold">
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
