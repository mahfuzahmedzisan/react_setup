import { Heart, MessageCircle, Pause, Play, Send, Volume2, VolumeX, X, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { demoReels } from '@/features/infinite-scroll/mockReels';

type ModalType = 'likes' | 'comments' | 'share' | null;

type ActionButtonProps = {
  icon: LucideIcon;
  count: number;
  label: string;
  onClick: () => void;
};

function ActionButton({ icon: Icon, count, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-14 flex-col items-center gap-1 text-white transition hover:scale-105"
      aria-label={label}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-lg">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium">{count.toLocaleString()}</span>
    </button>
  );
}

function ReelModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center bg-black/65 p-4 md:items-center">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ReelsDemoPage() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeReelId, setActiveReelId] = useState<number | null>(demoReels[0]?.id ?? null);
  const [mutedByReel, setMutedByReel] = useState<Record<number, boolean>>({});
  const [volumeByReel, setVolumeByReel] = useState<Record<number, number>>({});
  const [pausedByReel, setPausedByReel] = useState<Record<number, boolean>>({});
  const [durationByReel, setDurationByReel] = useState<Record<number, number>>({});
  const [currentTimeByReel, setCurrentTimeByReel] = useState<Record<number, number>>({});
  const [commentsDraft, setCommentsDraft] = useState('');

  const feedRef = useRef<HTMLElement | null>(null);
  const reelItemRefs = useRef(new Map<number, HTMLElement>());
  const mainVideoRefs = useRef(new Map<number, HTMLVideoElement>());
  const bgVideoRefs = useRef(new Map<number, HTMLVideoElement>());

  const activeReel = useMemo(
    () => demoReels.find((reel) => reel.id === activeReelId) ?? demoReels[0],
    [activeReelId],
  );

  const syncBgWithMain = (reelId: number) => {
    const mainVideo = mainVideoRefs.current.get(reelId);
    const bgVideo = bgVideoRefs.current.get(reelId);
    if (!mainVideo || !bgVideo) return;

    if (Math.abs(mainVideo.currentTime - bgVideo.currentTime) > 0.25) {
      bgVideo.currentTime = mainVideo.currentTime;
    }

    if (mainVideo.paused) bgVideo.pause();
    else void bgVideo.play().catch(() => undefined);
  };

  const togglePlayPause = (reelId: number) => {
    const mainVideo = mainVideoRefs.current.get(reelId);
    const bgVideo = bgVideoRefs.current.get(reelId);
    if (!mainVideo) return;

    if (mainVideo.paused) {
      void mainVideo.play().catch(() => undefined);
      void bgVideo?.play().catch(() => undefined);
      setPausedByReel((prev) => (prev[reelId] === false ? prev : { ...prev, [reelId]: false }));
      return;
    }

    mainVideo.pause();
    bgVideo?.pause();
    setPausedByReel((prev) => (prev[reelId] === true ? prev : { ...prev, [reelId]: true }));
  };

  const toggleMute = (reelId: number) => {
    const mainVideo = mainVideoRefs.current.get(reelId);
    if (!mainVideo) return;
    const nextMuted = !mainVideo.muted;
    mainVideo.muted = nextMuted;
    setMutedByReel((prev) => ({ ...prev, [reelId]: nextMuted }));
  };

  const setVolume = (reelId: number, volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    const mainVideo = mainVideoRefs.current.get(reelId);
    if (mainVideo) {
      mainVideo.volume = clamped;
      mainVideo.muted = clamped === 0;
    }
    setVolumeByReel((prev) => ({ ...prev, [reelId]: clamped }));
    setMutedByReel((prev) => ({ ...prev, [reelId]: clamped === 0 }));
  };

  const seekTo = (reelId: number, time: number) => {
    const mainVideo = mainVideoRefs.current.get(reelId);
    const bgVideo = bgVideoRefs.current.get(reelId);
    if (!mainVideo) return;
    mainVideo.currentTime = time;
    if (bgVideo) bgVideo.currentTime = time;
    setCurrentTimeByReel((prev) => ({ ...prev, [reelId]: time }));
  };

  const modalTitle =
    activeModal === 'likes'
      ? t('demo.reelsLikes')
      : activeModal === 'comments'
        ? t('demo.reelsComments')
        : t('demo.reelsShare');

  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const nextId = best?.target.getAttribute('data-reel-id');
        if (!nextId) return;
        const reelId = Number(nextId);
        if (!Number.isFinite(reelId)) return;
        setActiveReelId((prev) => (prev === reelId ? prev : reelId));
      },
      { root, threshold: [0.55, 0.75, 0.95] },
    );

    for (const node of reelItemRefs.current.values()) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeReelId == null) return;

    for (const [id, video] of mainVideoRefs.current.entries()) {
      if (id === activeReelId) {
        video.muted = mutedByReel[id] ?? false;
        video.volume = volumeByReel[id] ?? 0.75;
        if (!(pausedByReel[id] ?? false)) void video.play().catch(() => undefined);
        else video.pause();
      } else {
        video.pause();
        video.muted = true;
      }
    }

    for (const [id, bgVideo] of bgVideoRefs.current.entries()) {
      if (id === activeReelId && !(pausedByReel[id] ?? false)) void bgVideo.play().catch(() => undefined);
      else bgVideo.pause();
    }
  }, [activeReelId, mutedByReel, pausedByReel, volumeByReel]);

  return (
    <>
      <PageMeta
        title={t('meta.demoReelsTitle')}
        description={t('meta.demoReelsDescription')}
        keywords={t('meta.demoReelsKeywords')}
      />

      <div className="-mx-4 bg-radial-[ellipse_at_center] from-indigo-900/25 via-background to-background px-4 py-4 md:py-6">
        <div className="mx-auto mb-4 max-w-4xl text-center">
          <p className="text-balance text-sm text-muted-foreground md:text-base">{t('demo.reelsDescription')}</p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <section
            ref={feedRef}
            className="mx-auto h-[80dvh] max-h-[860px] w-full max-w-[420px] snap-y snap-mandatory overflow-y-auto rounded-4xl border border-white/15 bg-black shadow-[0_35px_100px_rgba(0,0,0,0.55)]"
            aria-label={t('demo.reelsTitle')}
          >
            {demoReels.map((reel) => {
              const paused = pausedByReel[reel.id] ?? false;
              const muted = mutedByReel[reel.id] ?? false;
              const volume = volumeByReel[reel.id] ?? 0.75;
              const duration = durationByReel[reel.id] ?? 0;
              const currentTime = currentTimeByReel[reel.id] ?? 0;

              return (
                <article
                  key={reel.id}
                  data-reel-id={reel.id}
                  ref={(node) => {
                    if (node) reelItemRefs.current.set(reel.id, node);
                    else reelItemRefs.current.delete(reel.id);
                  }}
                  className="relative flex h-[80dvh] max-h-[860px] min-h-[560px] snap-start items-center justify-center overflow-hidden"
                  onMouseEnter={() => setActiveReelId(reel.id)}
                  onFocus={() => setActiveReelId(reel.id)}
                >
                  <div className="pointer-events-none absolute inset-0 z-0 scale-115 blur-2xl">
                    <video
                      ref={(node) => {
                        if (node) bgVideoRefs.current.set(reel.id, node);
                        else bgVideoRefs.current.delete(reel.id);
                      }}
                      src={reel.videoUrl}
                      className="h-full w-full object-cover opacity-90"
                      onTimeUpdate={() => syncBgWithMain(reel.id)}
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>

                  <video
                    ref={(node) => {
                      if (node) {
                        mainVideoRefs.current.set(reel.id, node);
                        node.loop = true;
                        node.playsInline = true;
                        node.preload = 'metadata';
                        node.muted = muted;
                        node.volume = volume;
                      } else {
                        mainVideoRefs.current.delete(reel.id);
                      }
                    }}
                    src={reel.videoUrl}
                    className="relative z-20 h-full w-full object-contain"
                    onClick={() => togglePlayPause(reel.id)}
                    onLoadedMetadata={(e) => {
                      const loadedDuration = e.currentTarget?.duration;
                      const safeDuration = Number.isFinite(loadedDuration) ? loadedDuration : 0;
                      setDurationByReel((prev) => ({ ...prev, [reel.id]: safeDuration }));
                    }}
                    onPlay={() => {
                      setPausedByReel((prev) => (prev[reel.id] === false ? prev : { ...prev, [reel.id]: false }));
                      syncBgWithMain(reel.id);
                    }}
                    onPause={() => {
                      setPausedByReel((prev) => (prev[reel.id] === true ? prev : { ...prev, [reel.id]: true }));
                      syncBgWithMain(reel.id);
                    }}
                    onSeeked={() => syncBgWithMain(reel.id)}
                    onTimeUpdate={(e) => {
                      syncBgWithMain(reel.id);
                      if (activeReelId !== reel.id) return;
                      const t = e.currentTarget.currentTime;
                      setCurrentTimeByReel((prev) => {
                        const current = prev[reel.id] ?? 0;
                        if (Math.abs(current - t) < 0.15) return prev;
                        return { ...prev, [reel.id]: t };
                      });
                    }}
                  />

                  <div className="absolute top-3 left-3 z-30 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                    Reels
                  </div>

                  <div className="absolute right-3 top-3 z-30 w-[150px] space-y-2 rounded-2xl border border-white/20 bg-black/35 p-2 backdrop-blur-xl">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25"
                        onClick={() => togglePlayPause(reel.id)}
                      >
                        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25"
                        onClick={() => toggleMute(reel.id)}
                      >
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={muted ? 0 : volume}
                      onChange={(e) => setVolume(reel.id, Number(e.target.value))}
                      className="h-1.5 w-full accent-white"
                      aria-label="Volume level"
                    />
                  </div>

                  <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4">
                    <ActionButton
                      icon={Heart}
                      count={reel.likes}
                      label={t('demo.reelsLikes')}
                      onClick={() => {
                        setActiveReelId(reel.id);
                        setActiveModal('likes');
                      }}
                    />
                    <ActionButton
                      icon={MessageCircle}
                      count={reel.comments}
                      label={t('demo.reelsComments')}
                      onClick={() => {
                        setActiveReelId(reel.id);
                        setActiveModal('comments');
                      }}
                    />
                    <ActionButton
                      icon={Send}
                      count={reel.shares}
                      label={t('demo.reelsShare')}
                      onClick={() => {
                        setActiveReelId(reel.id);
                        setActiveModal('share');
                      }}
                    />
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 z-30 bg-linear-to-t from-black/95 via-black/45 to-transparent p-4 pt-20 text-white">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur-lg">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{reel.username}</p>
                        <span className="rounded-full border border-white/30 px-2 py-0.5 text-[11px]">Follow</span>
                      </div>
                      <p className="mt-1 pr-14 text-sm text-white/90">{reel.caption}</p>
                      <div className="mt-3 space-y-1">
                        <input
                          type="range"
                          min={0}
                          max={Math.max(duration, 0.1)}
                          step={0.1}
                          value={Math.min(currentTime, Math.max(duration, 0.1))}
                          onChange={(e) => seekTo(reel.id, Number(e.target.value))}
                          className="h-1.5 w-full accent-white"
                          aria-label={`${t('common.more')} timeline`}
                        />
                        <div className="flex justify-between text-[11px] text-white/80">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>

      <ReelModal open={activeModal !== null} title={modalTitle} onClose={() => setActiveModal(null)}>
        {activeModal === 'likes' ? (
          <div className="space-y-2 text-sm">
            <p className="font-medium">{activeReel?.username}</p>
            <p className="text-muted-foreground">{activeReel?.likes.toLocaleString()} likes on this reel.</p>
          </div>
        ) : null}

        {activeModal === 'comments' ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{activeReel?.comments.toLocaleString()} comments</p>
            <Textarea
              value={commentsDraft}
              onChange={(e) => setCommentsDraft(e.target.value)}
              placeholder={t('demo.reelsCommentPlaceholder')}
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="button" onClick={() => setCommentsDraft('')}>
                {t('demo.reelsPostComment')}
              </Button>
            </div>
          </div>
        ) : null}

        {activeModal === 'share' ? (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{t('demo.reelsShareHint')}</p>
            <div className="grid grid-cols-3 gap-2">
              {['WhatsApp', 'Instagram', 'X'].map((channel) => (
                <Button key={channel} type="button" variant="outline" className="w-full">
                  {channel}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </ReelModal>
    </>
  );
}
