import { useState, useCallback } from 'react';
import Image from '@/components/image/image';
import type { ImageLoadingState, Breakpoint } from '@/components/image/image.types';

// ─── Demo helpers ─────────────────────────────────────────────────────────────

// A tiny base64 LQIP (5×4 blue-ish gradient, for demo)
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAQABQMBIgACEQEDEQH/xABQAAEAAAAAAAAAAAAAAAAAAAAKEAEBAAMBAAAAAAAAAAAAAAAAAAUGBwgRAQADAQEAAAAAAAAAAAAAAAACBAUGExEBAAMBAQEAAAAAAAAAAAAAAAABAgMEEv/aAAwDAQACEQMRAD8AiIiJmYmImZi5iImZiIiImYiIiJiIiImYiIiJ/9k=';

// Simulated custom Imgix-style loader
const myLoader = ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
  `${src}?w=${width}&q=${quality}&auto=format`;

const RESPONSIVE_SIZES: Breakpoint[] = [
  { maxWidth: 640, size: '100vw' },
  { maxWidth: 1024, size: '50vw' },
  { size: '33vw' },
];

// ─── Section component ────────────────────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h2>
        {description && (
          <p style={{ fontSize: 14, color: '#64748b', margin: '6px 0 0' }}>{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Demo Card ────────────────────────────────────────────────────────────────
function DemoCard({
  label,
  code,
  children,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
      }}
    >
      <div style={{ padding: '16px 20px' }}>{children}</div>
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc',
          padding: '10px 20px',
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '0 0 4px' }}>
          {label}
        </p>
        <code
          style={{ fontSize: 11, color: '#475569', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
        >
          {code}
        </code>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function ImageDemoPage() {
  const [stateLog, setStateLog] = useState<string[]>([]);

  const logState = useCallback(
    (label: string) => (state: ImageLoadingState) => {
      setStateLog((prev) => [`[${label}] → ${state}`, ...prev].slice(0, 10));
    },
    [],
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        maxWidth: 1100,
        margin: '0 auto',
        padding: '40px 24px 80px',
        color: '#0f172a',
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 48 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#0f172a',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 16,
            letterSpacing: '.02em',
          }}
        >
          <span style={{ opacity: 0.6 }}>⚡</span> Vite 8 · React 19
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-.02em' }}>
          &lt;Image /&gt; Component
        </h1>
        <p style={{ fontSize: 16, color: '#475569', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
          Industry-standard optimized image component with lazy loading, blur placeholders,
          responsive srcSet, CDN loaders, error fallbacks, and more.
        </p>
      </header>

      {/* 1. Shimmer placeholder (default) */}
      <Section
        title="1. Shimmer Placeholder (default)"
        description="Animated shimmer while the image loads. Scroll down to trigger lazy loading."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {[
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
          ].map((url, i) => (
            <DemoCard
              key={url}
              label={`placeholder="shimmer" (default)`}
              code={`<Image src="..." alt="..." width={800} height={533} />`}
            >
              <Image
                src={url}
                alt={`Landscape ${i + 1}`}
                width={800}
                height={533}
                placeholder="shimmer"
                style={{ borderRadius: 8 }}
                wrapperStyle={{ borderRadius: 8 }}
                onLoadingStateChange={logState(`Shimmer #${i + 1}`)}
              />
            </DemoCard>
          ))}
        </div>
      </Section>

      {/* 2. Blur placeholder */}
      <Section
        title="2. Blur-Up Placeholder (LQIP)"
        description='placeholder="blur" shows a blurred preview while the full image loads.'
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          <DemoCard
            label='placeholder="blur" with blurDataURL'
            code={`<Image src="..." alt="..." width={1200} height={800}
  placeholder="blur" blurDataURL={LQIP_BASE64} />`}
          >
            <Image
              src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200"
              alt="Stunning mountain vista"
              width={1200}
              height={800}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              blurRadius={24}
              style={{ borderRadius: 8 }}
              wrapperStyle={{ borderRadius: 8 }}
              onLoadingStateChange={logState('Blur LQIP')}
            />
          </DemoCard>

          <DemoCard
            label='placeholder="color" — flat color fill'
            code={`<Image ... placeholder="color" placeholderColor="#c7d2fe" />`}
          >
            <Image
              src="https://images.unsplash.com/photo-1555436169-b8e0dab80ccc?w=1200"
              alt="Tech workspace"
              width={1200}
              height={800}
              placeholder="color"
              placeholderColor="#c7d2fe"
              style={{ borderRadius: 8 }}
              wrapperStyle={{ borderRadius: 8 }}
              onLoadingStateChange={logState('Color placeholder')}
            />
          </DemoCard>
        </div>
      </Section>

      {/* 3. Fill mode */}
      <Section
        title="3. Fill Mode"
        description="fill={true} makes the image fill its positioned parent — perfect for hero sections."
      >
        <DemoCard
          label="fill={true} — parent has position:relative and a defined height"
          code={`<div style={{ position: "relative", height: 400 }}>
  <Image src="..." alt="..." fill objectFit="cover" />
</div>`}
        >
          <div
            style={{
              position: 'relative',
              height: 360,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920"
              alt="Aerial forest view"
              fill
              objectFit="cover"
              objectPosition="center 60%"
              placeholder="shimmer"
              priority
              onLoadingStateChange={logState('Fill')}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 24,
                zIndex: 10,
              }}
            >
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
                fill + priority — no layout shift
              </p>
            </div>
          </div>
        </DemoCard>
      </Section>

      {/* 4. Priority */}
      <Section
        title="4. Priority Loading"
        description="priority={true} sets fetchpriority=high, loading=eager, and injects a <link rel=preload> into <head>."
      >
        <DemoCard
          label="Above-the-fold hero images should always use priority"
          code={`<Image src="..." alt="..." width={1200} height={630} priority />`}
        >
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"
            alt="Modern office interior"
            width={1200}
            height={630}
            priority
            placeholder="shimmer"
            style={{ borderRadius: 8 }}
            wrapperStyle={{ borderRadius: 8 }}
            onLoadingStateChange={logState('Priority')}
          />
        </DemoCard>
      </Section>

      {/* 5. objectFit variants */}
      <Section
        title="5. objectFit Variants"
        description="Control how the image fits its container — cover, contain, fill, none, scale-down."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {(['cover', 'contain', 'fill', 'none', 'scale-down'] as const).map((fit) => (
            <DemoCard key={fit} label={`objectFit="${fit}"`} code={`objectFit="${fit}"`}>
              <div
                style={{
                  position: 'relative',
                  height: 160,
                  background: '#f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400"
                  alt={`objectFit ${fit}`}
                  fill
                  objectFit={fit}
                  placeholder="color"
                  placeholderColor="#e0e7ff"
                />
              </div>
            </DemoCard>
          ))}
        </div>
      </Section>

      {/* 6. Responsive with aspectRatio */}
      <Section
        title="6. Responsive + Aspect Ratio"
        description="Use aspectRatio to lock the ratio without specifying a fixed height."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {[
            { ratio: '16/9', label: '16:9 Widescreen' },
            { ratio: '4/3', label: '4:3 Classic' },
            { ratio: '1/1', label: '1:1 Square' },
            { ratio: '9/16', label: '9:16 Portrait' },
          ].map(({ ratio, label }) => (
            <DemoCard key={ratio} label={label} code={`aspectRatio="${ratio}"`}>
              <Image
                src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800"
                alt={label}
                width={800}
                aspectRatio={ratio}
                placeholder="shimmer"
                style={{ borderRadius: 6 }}
                wrapperStyle={{ borderRadius: 6 }}
              />
            </DemoCard>
          ))}
        </div>
      </Section>

      {/* 7. Error fallback */}
      <Section
        title="7. Error Handling & Fallbacks"
        description="Broken images fall back gracefully — either to fallbackSrc or a custom element."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <DemoCard
            label="fallbackSrc — loads secondary URL on error"
            code={`<Image src="broken-url" fallbackSrc="/fallback.jpg" alt="..." />`}
          >
            <Image
              src="https://this-url-does-not-exist.invalid/image.jpg"
              fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
              alt="Fallback example"
              width={600}
              height={400}
              placeholder="color"
              placeholderColor="#fef3c7"
              style={{ borderRadius: 8 }}
              wrapperStyle={{ borderRadius: 8 }}
              onLoadingStateChange={logState('Fallback')}
            />
          </DemoCard>

          <DemoCard
            label="fallbackElement — render custom error UI"
            code={`<Image src="broken" fallbackElement={<MyErrorUI />} alt="..." />`}
          >
            <Image
              src="https://also-broken.invalid/img.webp"
              alt="Custom error fallback"
              width={600}
              height={400}
              placeholder="color"
              placeholderColor="#fee2e2"
              style={{ borderRadius: 8 }}
              wrapperStyle={{ height: 200, borderRadius: 8 }}
              fallbackElement={
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff5f5',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 32 }}>🖼️</span>
                  <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                    Image unavailable
                  </span>
                </div>
              }
              onLoadingStateChange={logState('Custom fallback')}
            />
          </DemoCard>
        </div>
      </Section>

      {/* 8. Custom Loader */}
      <Section
        title="8. Custom Loader / CDN Integration"
        description="Pass a loader function or set cdn= to Cloudinary / Imgix / BunnyCDN presets."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <DemoCard
            label="Custom loader function"
            code={`const myLoader = ({ src, width, quality }) =>
  \`\${src}?w=\${width}&q=\${quality}&auto=format\`

<Image loader={myLoader} src="..." alt="..." />`}
          >
            <Image
              loader={myLoader}
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b"
              alt="Custom loader demo"
              width={800}
              height={533}
              quality={85}
              placeholder="shimmer"
              sizes={RESPONSIVE_SIZES}
              style={{ borderRadius: 8 }}
              wrapperStyle={{ borderRadius: 8 }}
              onLoadingStateChange={logState('Custom loader')}
            />
          </DemoCard>

          <DemoCard
            label='cdn="imgix" preset'
            code={`<Image
  cdn="imgix"
  cdnBaseURL="https://your-project.imgix.net"
  src="/mountain.jpg"
  alt="..." />`}
          >
            {/* Unoptimized fallback since we don't have a real imgix domain */}
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format"
              alt="Imgix CDN preset example"
              width={800}
              height={533}
              unoptimized
              placeholder="shimmer"
              style={{ borderRadius: 8 }}
              wrapperStyle={{ borderRadius: 8 }}
              onLoadingStateChange={logState('Imgix preset')}
            />
          </DemoCard>
        </div>
      </Section>

      {/* 9. Unoptimized */}
      <Section
        title="9. Unoptimized — SVG / GIF passthrough"
        description="unoptimized={true} skips srcSet generation. Perfect for animated GIFs and SVGs."
      >
        <DemoCard
          label="unoptimized={true} — no srcSet, no width transforms"
          code={`<Image src="animation.gif" alt="..." unoptimized />`}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loading spinner GIF"
            width={128}
            height={128}
            unoptimized
            placeholder="empty"
            wrapperStyle={{ display: 'inline-block' }}
          />
        </DemoCard>
      </Section>

      {/* 10. State log */}
      <Section
        title="10. onLoadingStateChange Callback"
        description="Every state transition (idle → loading → loaded / error) is emitted."
      >
        <div
          style={{
            background: '#0f172a',
            borderRadius: 10,
            padding: '16px 20px',
            fontFamily: 'monospace',
            minHeight: 120,
          }}
        >
          {stateLog.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
              Scroll through examples above to see state transitions…
            </p>
          ) : (
            stateLog.map((line, i) => (
              <p
                key={i}
                style={{ color: i === 0 ? '#4ade80' : '#64748b', fontSize: 13, margin: '2px 0' }}
              >
                {line}
              </p>
            ))
          )}
        </div>
      </Section>
    </div>
  );
}
