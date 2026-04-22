import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VirtualizedInfiniteList } from '@/features/infinite-scroll/VirtualizedInfiniteList';
import { fetchMockProductsPage } from '@/features/infinite-scroll/mockProductsPage';
import type { DemoProduct } from '@/features/infinite-scroll/types';
import { useInfiniteWindowQuery } from '@/features/infinite-scroll/useInfiniteWindowQuery';
import Heading from '@/components/heading';
import Loading from '@/components/Loading';

const PAGE_SIZE = 20;
const ROW_HEIGHT = 72;

export default function CatalogDemoPage() {
  const { t } = useTranslation();

  const infinite = useInfiniteWindowQuery({
    queryKey: ['demo-catalog-products', PAGE_SIZE],
    fetchPage: (page, signal) => fetchMockProductsPage(page, PAGE_SIZE, signal),
  });

  const items = useMemo(
    () => infinite.data?.pages.flatMap((p) => p.items) ?? [],
    [infinite.data],
  );

  const renderItem = useCallback((product: DemoProduct) => {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">SKU #{product.id}</p>
        </div>
        <Badge variant="secondary">{product.priceLabel}</Badge>
      </div>
    );
  }, []);

  const loadingContent = useMemo(
    () => (infinite.isFetchingNextPage ? t('demo.loadingMore') : null),
    [infinite.isFetchingNextPage, t],
  );

  return (
    <>
      <PageMeta
        title={t('meta.demoCatalogTitle')}
        description={t('meta.demoCatalogDescription')}
        keywords={t('meta.demoCatalogKeywords')}
      />
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <div className="space-y-1">
          <Heading title={t('demo.catalogTitle')} description={t('demo.catalogDescription')} />
        </div>

        {infinite.isError ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">{t('demo.initialError')}</p>
            <Button type="button" variant="outline" className="mt-3" onClick={() => void infinite.refetch()}>
              {t('demo.tryAgain')}
            </Button>
          </div>
        ) : infinite.isPending ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loading />
          </div>
        ) : (
          <VirtualizedInfiniteList
            items={items}
            itemHeight={ROW_HEIGHT}
            renderItem={renderItem}
            hasNextPage={infinite.hasNextPage}
            isFetchingNextPage={infinite.isFetchingNextPage}
            fetchNextPage={() => void infinite.fetchNextPage()}
            loadingContent={loadingContent}
          />
        )}
      </div>
    </>
  );
}
