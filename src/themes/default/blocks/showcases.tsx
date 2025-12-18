'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Link, useRouter } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

// Adaptive image component that maintains natural aspect ratio
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

export function Showcases({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const router = useRouter();

  const buildHrefWithPrompt = (url: string, prompt?: string) => {
    const safeUrl = url?.trim() || '/nanobanana-ai-image-generator';
    if (!prompt?.trim()) return safeUrl;
    const [path, search = ''] = safeUrl.split('?');
    const params = new URLSearchParams(search);
    params.set('prompt', prompt.trim());
    return `${path}?${params.toString()}`;
  };

  const setPromptSessionStorage = (prompt?: string) => {
    if (!prompt?.trim()) return;
    try {
      window.sessionStorage.setItem('nanobanana:prefill-prompt', prompt.trim());
    } catch {
      // ignore
    }
  };

  const groups = (section as any).groups || [];
  const [selectedGroup, setSelectedGroup] = useState<string>(
    groups.length > 0 ? groups[0].name : ''
  );

  const filteredItems = useMemo(() => {
    if (!section.items) return [];
    if (!selectedGroup || !groups.length) return section.items;
    if (selectedGroup === 'all') return section.items;
    return section.items.filter((item) => item.group === selectedGroup);
  }, [section.items, selectedGroup, groups.length]);

  return (
    <section
      id={section.id || section.name}
      className={cn('py-24 md:py-36', section.className, className)}
    >
      <motion.div
        className="container mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        {section.sr_only_title && (
          <h1 className="sr-only">{section.sr_only_title}</h1>
        )}
        <h2 className="mx-auto mb-6 max-w-full text-3xl font-bold text-pretty md:max-w-5xl lg:text-4xl">
          {section.title}
        </h2>
        <p className="text-muted-foreground text-md mx-auto mb-4 max-w-full md:max-w-5xl">
          {section.description}
        </p>
      </motion.div>

      {groups.length > 0 && (
        <motion.div
          className="container mb-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          {groups.map(
            (group: { name: string; title: string }, index: number) => {
              const isSelected = selectedGroup === group.name;
              return (
                <motion.button
                  key={group.name}
                  onClick={() => setSelectedGroup(group.name)}
                  className={cn(
                    'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    isSelected
                      ? ''
                      : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground border'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSelected ? (
                    <>
                      <span className="bg-primary absolute inset-0 rounded-lg p-[2px]">
                        <span className="bg-background block h-full w-full rounded-[calc(0.5rem-2px)]" />
                      </span>
                      <span className="bg-primary relative z-10 bg-clip-text text-transparent">
                        {group.title}
                      </span>
                    </>
                  ) : (
                    <span>{group.title}</span>
                  )}
                </motion.button>
              );
            }
          )}
        </motion.div>
      )}

      {/* Masonry-style grid with columns */}
      <div className="container columns-1 gap-6 md:columns-2 lg:columns-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const hasButton = !!(item as any).button;
            const itemPrompt = (item as any).prompt as string | undefined;
            const href = buildHrefWithPrompt(item.url || '', itemPrompt);

            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <Card className="dark:hover:shadow-primary/10 overflow-hidden p-0 transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    {/* Adaptive image that respects natural aspect ratio */}
                    <motion.div
                      className="relative w-full overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AdaptiveImage
                        src={item.image?.src ?? ''}
                        alt={item.image?.alt ?? ''}
                      />

                      {itemPrompt?.trim() && (
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                          <p className="line-clamp-5 text-xs leading-relaxed text-white/90">
                            {itemPrompt.trim()}
                          </p>
                          <div className="mt-3 flex gap-2">
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
                                    itemPrompt.trim()
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
                                setPromptSessionStorage(itemPrompt);
                                router.push(href);
                              }}
                            >
                              Use prompt
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                    <div className="p-6">
                      <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-balance">
                        {item.title}
                      </h3>
                      <p
                        className="text-muted-foreground line-clamp-3 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: item.description ?? '',
                        }}
                      />
                      {hasButton && (
                        <div className="mt-4">
                          <Button
                            asChild
                            variant={(item as any).button.variant || 'default'}
                            size={(item as any).button.size || 'sm'}
                            className="bg-primary hover:bg-primary/90 h-8 w-full border-0 px-3 py-1.5 text-sm font-medium text-white"
                          >
                            <Link
                              href={(item as any).button.url || ''}
                              target={(item as any).button.target || '_self'}
                            >
                              {(item as any).button.icon && (
                                <SmartIcon
                                  name={(item as any).button.icon as string}
                                  className="text-white"
                                />
                              )}
                              {(item as any).button.title}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );

            return hasButton ? (
              <div key={index} className="group mb-6 break-inside-avoid">
                {cardContent}
              </div>
            ) : (
              <div
                key={index}
                className="group mb-6 break-inside-avoid cursor-pointer"
                role="link"
                tabIndex={0}
                onClick={() => {
                  setPromptSessionStorage(itemPrompt);
                  router.push(href);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  setPromptSessionStorage(itemPrompt);
                  router.push(href);
                }}
              >
                {cardContent}
              </div>
            );
          })
        ) : (
          <motion.div
            className="text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            No items found in this category.
          </motion.div>
        )}
      </div>
    </section>
  );
}
