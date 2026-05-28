import { getTranslations } from 'next-intl/server';
import { getSettings } from '@/lib/actions/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import SettingsForm from './settings-form';

export default async function SettingsPage() {
  const t = await getTranslations('admin.settings');
  const settings = await getSettings();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 font-medium">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('companyInfo')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="font-semibold">
              {t('companyName')}
            </Label>
            <SettingsForm initialCompanyName={settings.companyName} />
            <p className="text-sm text-muted-foreground mt-1">{t('companyNameHint')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
