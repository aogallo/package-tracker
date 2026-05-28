'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('admin.clients');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await action(formData);
      toast.success(initialData ? t('form.toastUpdated') : t('form.toastCreated'));
      router.push('/admin/clients');
      router.refresh();
    } catch (error) {
      toast.error(t('form.toastError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? t('form.editTitle') : t('form.newTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.nameLabel')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialData?.name}
              placeholder={t('form.namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('form.emailLabel')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialData?.email}
              placeholder={t('form.emailPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('form.phoneLabel')}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialData?.phone}
              placeholder={t('form.phonePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('form.addressLabel')}</Label>
            <Input
              id="address"
              name="address"
              type="text"
              defaultValue={initialData?.address}
              placeholder={t('form.addressPlaceholder')}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('form.saving')
                : initialData
                  ? t('form.updateButton')
                  : t('form.createButton')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/clients')}>
              {t('form.cancelButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
