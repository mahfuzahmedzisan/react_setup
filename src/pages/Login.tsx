import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  extractBearerTokenFromLoginBody,
  extractRefreshTokenFromLoginBody,
  extractUserFromAuthPayload,
} from '@/api/laravelResponse';
import { useAuth } from '@/auth/useAuth';
import { request } from '@/api/request';
import { env } from '@/config/env';
import { setRefreshToken } from '@/auth/token';
import { rolePolicy } from '@/auth/rolePolicy';
import { getUserRoles } from '@/auth/roles';
import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function nextParamPointsAtLoginLoop(nextRaw: string | null) {
  if (!nextRaw) return false;
  let s = nextRaw;
  for (let i = 0; i < 8; i++) {
    if (s.includes('/login')) return true;
    try {
      s = decodeURIComponent(s);
    } catch {
      return true;
    }
  }
  return s.includes('/login');
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setToken, setUser, refreshSession, authStrategy } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { t } = useTranslation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    const next = searchParams.get('next');
    if (nextParamPointsAtLoginLoop(next)) {
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await request.post<unknown>('/login', values);
      const body = res.data;
      const loggedInUser = extractUserFromAuthPayload(body);

      if (authStrategy === 'http_only_cookie') {
        const u = await refreshSession();
        if (!u) {
          throw new Error(t('auth.noSessionCookie'));
        }
      } else {
        const token = extractBearerTokenFromLoginBody(body);
        if (!token) {
          throw new Error(t('auth.noToken'));
        }
        setToken(token);
        const refresh = extractRefreshTokenFromLoginBody(body);
        if (refresh) setRefreshToken(refresh);
        if (loggedInUser) setUser(loggedInUser);
        await refreshSession();
      }

      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      // Role-aware post-login landing (policy-driven)
      const roles = getUserRoles(loggedInUser);
      for (const r of roles) {
        const dash = rolePolicy[r]?.dashboard;
        if (dash) {
          navigate(dash, { replace: true });
          return;
        }
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const fallback = t('auth.loginFailed');
      const message = err instanceof Error ? err.message : fallback;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageMeta
        title={t('meta.loginTitle')}
        description={t('meta.loginDescription')}
        keywords={t('meta.loginKeywords')}
      />
      <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('common.signIn')}</CardTitle>
            <CardDescription>
              {t('auth.authStrategy')}: <code className="text-xs">{env.authStrategy}</code>
              {authStrategy === 'http_only_cookie'
                ? ` - ${t('auth.expectsCookie')}`
                : ` - ${t('auth.bearerDetails', {
                    storage: env.bearerTokenPersistence,
                    refresh: env.refreshTokenEnabled ? t('auth.refreshSuffix') : '',
                  })}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="gap-4">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        placeholder={t('auth.emailPlaceholder')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
              <Button className="w-full" disabled={loading} type="submit">
                {loading ? t('auth.signingIn') : t('common.signIn')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
