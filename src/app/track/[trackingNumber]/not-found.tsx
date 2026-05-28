import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('track');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <Search className="w-10 h-10 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-foreground mb-4">{t('notFound.title')}</h1>
        <p className="text-lg text-muted-foreground mb-8">{t('notFound.description')}</p>

        {/* Help Card */}
        <Card className="text-left mb-8">
          <CardContent className="pt-6">
            <h2 className="font-semibold text-lg mb-4">{t('notFound.helpTitle')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('notFound.helpCheckNumber')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('notFound.helpLength')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('notFound.helpCopyPaste')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('notFound.helpContact')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/track">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('notFound.backLink')}
            </Button>
          </Link>
        </div>

        {/* Package Icon */}
        <div className="mt-12 opacity-20">
          <Package className="w-24 h-24 mx-auto" />
        </div>
      </div>
    </div>
  );
}
