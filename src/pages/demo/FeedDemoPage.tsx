import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VirtualizedInfiniteList } from '@/features/infinite-scroll/VirtualizedInfiniteList';
import { fetchMockPostsPage } from '@/features/infinite-scroll/mockPostsPage';
import type { DemoPost } from '@/features/infinite-scroll/types';
import { useInfiniteWindowQuery } from '@/features/infinite-scroll/useInfiniteWindowQuery';
import Heading from '@/components/heading';
import Loading from '@/components/Loading';

const PAGE_SIZE = 12;
const ROW_HEIGHT = 132;

export default function FeedDemoPage() {
  const { t } = useTranslation();

  const infinite = useInfiniteWindowQuery({
    queryKey: ['demo-feed-posts', PAGE_SIZE],
    fetchPage: (page, signal) => fetchMockPostsPage(page, PAGE_SIZE, signal),
  });

  const items = useMemo(
    () => infinite.data?.pages.flatMap((p) => p.items) ?? [],
    [infinite.data],
  );

  const renderItem = useCallback((post: DemoPost) => {
    return (
      <div className="px-3 py-2">
        <Card className="shadow-none">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          </CardContent>
        </Card>
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
        title={t('meta.demoFeedTitle')}
        description={t('meta.demoFeedDescription')}
        keywords={t('meta.demoFeedKeywords')}
      />
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <div className="space-y-1">
          <Heading title={t('demo.feedTitle')} description={t('demo.feedDescription')} />
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
