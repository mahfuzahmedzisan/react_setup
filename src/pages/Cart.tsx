import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Cart() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t('meta.cartTitle')}
        description={t('meta.cartDescription')}
        keywords={t('meta.cartKeywords')}
      />
      <div className="mx-auto min-h-dvh max-w-5xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('common.cart')}</CardTitle>
            <CardDescription>{t('cart.cartStub')}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{t('cart.empty')}</div>
            <Button asChild type="button">
              <Link to="/">{t('cart.continueShopping')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
