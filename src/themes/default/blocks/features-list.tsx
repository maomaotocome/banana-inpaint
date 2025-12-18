'use client';

import Image from 'next/image';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function FeaturesList({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'overflow-x-hidden py-16 md:py-24',
        section.className,
        className
      )}
    >
      <div className="container overflow-x-hidden">
        {/* Modern bento-style layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Image - takes 5 columns on large screens */}
          <ScrollAnimation
            direction="left"
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-border/50 shadow-2xl lg:mx-0 lg:max-w-none">
              <Image
                src={section.image?.src ?? ''}
                alt={section.image?.alt ?? ''}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </ScrollAnimation>

          {/* Right: Content - takes 7 columns on large screens */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <ScrollAnimation delay={0.1}>
              <h2 className="text-foreground text-3xl font-bold tracking-tight text-balance break-words md:text-4xl lg:text-5xl">
                {section.title}
              </h2>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <p
                className="text-muted-foreground mt-6 text-lg leading-relaxed text-balance break-words"
                dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
              />
            </ScrollAnimation>

            {/* Feature highlights in a grid */}
            {section.items && section.items.length > 0 && (
              <ScrollAnimation delay={0.3}>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {section.items.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-3 rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    >
                      {item.icon && (
                        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
                          <SmartIcon
                            name={item.icon as string}
                            size={18}
                            className="text-primary"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold break-words">
                          {item.title}
                        </h3>
                        <p
                          className="text-muted-foreground mt-1 text-xs leading-relaxed break-words"
                          dangerouslySetInnerHTML={{
                            __html: item.description ?? '',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>
            )}

            {/* CTA Buttons */}
            {section.buttons && section.buttons.length > 0 && (
              <ScrollAnimation delay={0.4}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {section.buttons.map((button, idx) => (
                    <Button
                      asChild
                      key={idx}
                      variant={button.variant || 'default'}
                      size={button.size || 'lg'}
                      className={cn(
                        idx === 0 &&
                          'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
                      )}
                    >
                      <Link
                        href={button.url ?? ''}
                        target={button.target ?? '_self'}
                      >
                        {button.icon && (
                          <SmartIcon name={button.icon as string} size={20} />
                        )}
                        {button.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </ScrollAnimation>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
