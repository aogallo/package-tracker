'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateSettings } from '@/lib/actions/settings';

interface SettingsFormProps {
  initialCompanyName: string;
}

export default function SettingsForm({ initialCompanyName }: SettingsFormProps) {
  const t = useTranslations('admin.settings');
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ companyName });
      if (result.success) {
        toast.success(t('toastSaved'));
        router.refresh(); // Refresh server components
      } else {
        toast.error(t('toastError'));
      }
    } catch {
      toast.error(t('toastError'));
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
        placeholder={t('companyNamePlaceholder')}
        className="mt-1"
      />
      <Button onClick={handleSave} disabled={saving} className="font-semibold mt-4">
        {saving ? t('saving') : t('saveButton')}
      </Button>
    </>
  );
}
