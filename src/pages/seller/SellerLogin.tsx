import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SellerLogin() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.sellerSignIn')}</CardTitle>
          <CardDescription>{t('auth.fallbackSeller')}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild type="button">
            <Link to="/login">{t('auth.goToLogin')}</Link>
          </Button>
          <Button asChild variant="outline" type="button">
            <Link to="/">{t('common.home')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
