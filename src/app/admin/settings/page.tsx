import { getSettings } from '@/lib/actions/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import SettingsForm from './settings-form';

export default async function SettingsPage() {
  const settings = await getSettings();

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
            <SettingsForm initialCompanyName={settings.companyName} />
            <p className="text-sm text-muted-foreground mt-1">
              Este nombre aparecerá en los tickets PDF generados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
