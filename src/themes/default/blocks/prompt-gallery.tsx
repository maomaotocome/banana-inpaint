'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useRouter } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function PromptGallery({
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
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container">
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const prompt = (item as any).prompt as string | undefined;
            const category = (item as any).category as string | undefined;
            const href = buildGeneratorHref(prompt);

            return (
              <motion.div
                key={`${item.title ?? 'prompt'}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="group"
              >
                <Card className="dark:hover:shadow-primary/10 overflow-hidden p-0 transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={item.image?.src ?? ''}
                        alt={item.image?.alt ?? item.title ?? ''}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                        <h3 className="line-clamp-1 text-sm font-semibold text-white">
                          {item.title}
                        </h3>
                        {category && (
                          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white">
                            {category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 p-5">
                      {item.description && (
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      )}

                      {prompt?.trim() && (
                        <div
                          className="rounded-xl border bg-muted/40 p-3"
                          role="button"
                          tabIndex={0}
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(prompt.trim());
                              toast.success('Prompt copied');
                            } catch {
                              toast.error('Copy failed');
                            }
                          }}
                          onKeyDown={async (e) => {
                            if (e.key !== 'Enter' && e.key !== ' ') return;
                            e.preventDefault();
                            try {
                              await navigator.clipboard.writeText(prompt.trim());
                              toast.success('Prompt copied');
                            } catch {
                              toast.error('Copy failed');
                            }
                          }}
                        >
                          <p className="line-clamp-6 font-mono text-xs leading-relaxed">
                            {prompt.trim()}
                          </p>
                          <p className="text-muted-foreground mt-2 text-xs">
                            Click to copy
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-9 flex-1"
                          onClick={async () => {
                            if (!prompt?.trim()) return;
                            try {
                              await navigator.clipboard.writeText(prompt.trim());
                              toast.success('Prompt copied');
                            } catch {
                              toast.error('Copy failed');
                            }
                          }}
                          disabled={!prompt?.trim()}
                        >
                          Copy
                        </Button>
                        <Button
                          type="button"
                          className="h-9 flex-1"
                          onClick={() => {
                            setPromptSessionStorage(prompt);
                            router.push(href);
                          }}
                          disabled={!prompt?.trim()}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

