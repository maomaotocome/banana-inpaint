'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Link, useRouter } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

// Adaptive image component that maintains aspect ratio
function AdaptiveImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      style={{ aspectRatio: aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'object-cover transition-all duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            // Clamp aspect ratio between 3:4 (portrait) and 2:1 (landscape)
            const ratio = img.naturalWidth / img.naturalHeight;
            const clampedRatio = Math.max(0.75, Math.min(2, ratio));
            setAspectRatio(clampedRatio);
          }
          setLoaded(true);
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      )}
    </div>
  );
}

export function ImageGallery({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const router = useRouter();
  const items = section.items ?? [];

  const buildGeneratorHref = (prompt?: string) => {
    const basePath = '/nanobanana-ai-image-generator';
    if (!prompt?.trim()) return basePath;
    const params = new URLSearchParams();
    params.set('prompt', prompt.trim());
    return `${basePath}?${params.toString()}`;
  };

  const setPromptSessionStorage = (prompt?: string) => {
    if (!prompt?.trim()) return;
    try {
      window.sessionStorage.setItem('nanobanana:prefill-prompt', prompt.trim());
    } catch {
      // ignore
    }
  };

  return (
    <section
      id={section.id || section.name}
      className={cn('py-12 md:py-16', section.className, className)}
    >
      <div className="container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {section.label && (
            <p className="text-muted-foreground mb-3 text-sm font-medium">
              {section.label}
            </p>
          )}
          {section.sr_only_title && (
            <h1 className="sr-only">{section.sr_only_title}</h1>
          )}
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            {section.title}
          </h2>
          {section.description && (
            <p
              className="text-muted-foreground mt-4 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.description }}
            />
          )}
        </motion.div>

        {/* Masonry-style grid with columns */}
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {items.map((item, index) => {
            const prompt = (item as any).prompt as string | undefined;
            const href = buildGeneratorHref(prompt);

            return (
              <motion.div
                key={`${item.title ?? 'item'}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="group mb-6 break-inside-avoid"
                role="link"
                tabIndex={0}
                onClick={() => {
                  setPromptSessionStorage(prompt);
                  router.push(href);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  setPromptSessionStorage(prompt);
                  router.push(href);
                }}
              >
                <Card className="dark:hover:shadow-primary/10 overflow-hidden p-0 transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    {/* Adaptive image that respects natural aspect ratio */}
                    <div className="relative w-full overflow-hidden">
                      <AdaptiveImage
                        src={item.image?.src ?? ''}
                        alt={item.image?.alt ?? item.title ?? ''}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />

                      {prompt?.trim() && (
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                          <p className="line-clamp-5 text-xs leading-relaxed text-white/90">
                            {prompt.trim()}
                          </p>
                          <div
                            className="mt-3 flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-8 px-3"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                  await navigator.clipboard.writeText(
                                    prompt.trim()
                                  );
                                  toast.success('Prompt copied');
                                } catch {
                                  toast.error('Copy failed');
                                }
                              }}
                            >
                              Copy prompt
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 px-3"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPromptSessionStorage(prompt);
                                router.push(href);
                              }}
                            >
                              Use prompt
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      {item.title && (
                        <h3 className="line-clamp-1 text-base font-semibold">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/showcases">View full gallery</Link>
          </Button>
          <Button asChild>
            <Link href="/nanobanana-ai-image-generator">Open generator</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

