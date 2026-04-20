import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/auth/useAuth';

export default function Account() {
  const { accessToken, authStrategy, user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t('meta.accountTitle')}
        description={t('meta.accountDescription')}
        keywords={t('meta.accountKeywords')}
      />
      <div className="mx-auto min-h-dvh max-w-5xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('common.account')}</CardTitle>
            <CardDescription>
              {t('account.protectedArea')}: <code className="text-xs">{authStrategy}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="text-sm text-muted-foreground">
                {t('account.signedInAs')}{' '}
                <span className="font-medium text-foreground">
                  {user.name ?? user.email ?? String(user.id)}
                </span>
              </div>
            ) : null}
            <div className="text-sm text-muted-foreground">
              {t('account.bearerTokenInMemory')}:{' '}
              <span className="font-medium">{accessToken ? t('common.yes') : t('common.no')}</span>
              {authStrategy === 'http_only_cookie' ? (
                <span className="block text-xs">{t('account.cookieNotStored')}</span>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void logout();
              }}
            >
              {t('common.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
