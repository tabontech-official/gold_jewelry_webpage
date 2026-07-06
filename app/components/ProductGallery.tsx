import {useEffect, useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';

export type GalleryMedia = {
  key: string;
  kind: 'image' | 'video' | 'external';
  /** Thumbnail / poster url (available for every media type). */
  thumbUrl?: string | null;
  alt?: string | null;
  /** image */
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  /** video */
  sources?: Array<{url: string; mimeType?: string | null}>;
  /** external video */
  embedUrl?: string | null;
};

/**
 * Product media gallery: a large main stage (image OR playable video) plus a
 * thumbnail strip. Videos show a ▶ badge on their thumbnail. When the shopper
 * switches variant, `selectedImageUrl` changes and the gallery jumps to that
 * variant's image.
 */
export function ProductGallery({
  media,
  selectedImageUrl,
  title = 'Product',
}: {
  media: GalleryMedia[];
  selectedImageUrl?: string | null;
  title?: string;
}) {
  // Ensure the selected variant image is present in the gallery.
  const items = useMemo<GalleryMedia[]>(() => {
    const list = [...(media ?? [])];
    if (
      selectedImageUrl &&
      !list.some((m) => m.kind === 'image' && m.image?.url === selectedImageUrl)
    ) {
      list.unshift({
        key: selectedImageUrl,
        kind: 'image',
        thumbUrl: selectedImageUrl,
        image: {url: selectedImageUrl, altText: title},
      });
    }
    return list;
  }, [media, selectedImageUrl, title]);

  const [activeKey, setActiveKey] = useState<string>(
    () => items[0]?.key ?? '',
  );

  // Follow the variant selection to its matching image.
  useEffect(() => {
    if (!selectedImageUrl) return;
    const match = items.find(
      (m) => m.kind === 'image' && m.image?.url === selectedImageUrl,
    );
    if (match) setActiveKey(match.key);
  }, [selectedImageUrl, items]);

  const active =
    items.find((m) => m.key === activeKey) ?? items[0] ?? undefined;

  if (!active) {
    return <div className="product-gallery-empty" aria-hidden="true" />;
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        {active.kind === 'image' && active.image ? (
          <Image
            key={active.key}
            data={{
              url: active.image.url,
              altText: active.image.altText,
              width: active.image.width ?? undefined,
              height: active.image.height ?? undefined,
            }}
            alt={active.image.altText || active.alt || title}
            aspectRatio="1/1"
            sizes="(min-width: 48em) 50vw, 100vw"
          />
        ) : active.kind === 'video' && active.sources?.length ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            key={active.key}
            className="product-gallery-video"
            controls
            playsInline
            poster={active.thumbUrl || undefined}
          >
            {active.sources.map((source) => (
              <source
                key={source.url}
                src={source.url}
                type={source.mimeType || undefined}
              />
            ))}
          </video>
        ) : active.kind === 'external' && active.embedUrl ? (
          <iframe
            key={active.key}
            className="product-gallery-embed"
            src={active.embedUrl}
            title={active.alt || title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : null}
      </div>

      {items.length > 1 && (
        <div className="product-gallery-thumbs">
          {items.map((m) => {
            const isActive = m.key === activeKey;
            const thumb = m.thumbUrl || m.image?.url;
            return (
              <button
                key={m.key}
                type="button"
                className={`product-gallery-thumb ${isActive ? 'is-active' : ''}`}
                aria-label={
                  m.kind === 'image' ? 'View image' : 'Play video'
                }
                aria-current={isActive}
                onClick={() => setActiveKey(m.key)}
              >
                {thumb ? (
                  <img src={thumb} alt={m.alt || title} loading="lazy" />
                ) : (
                  <span className="product-gallery-thumb-fallback" />
                )}
                {m.kind !== 'image' && (
                  <span className="product-gallery-play" aria-hidden="true">
                    ▶
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
