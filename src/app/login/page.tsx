'use client';

import { loginAction } from '@/lib/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">{t('title')}</CardTitle>
          <CardDescription className="text-center">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { pending } = useFormStatus();
  const t = useTranslations('login');

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await loginAction(formData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('unexpectedError'));
      }
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive text-center bg-destructive/10 py-2 px-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t('submittingButton') : t('submitButton')}
      </Button>
    </form>
  );
}
