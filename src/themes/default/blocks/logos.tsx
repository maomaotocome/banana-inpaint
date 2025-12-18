'use client';

import { LazyImage } from '@/shared/blocks/common';
import { InfiniteSlider } from '@/shared/components/ui/infinite-slider';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Logos({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const hasEnoughItems = section.items && section.items.length >= 4;

  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="mx-auto max-w-5xl px-6">
        <ScrollAnimation>
          <p className="text-md text-center font-medium text-muted-foreground">
            {section.title}
          </p>
        </ScrollAnimation>
        <ScrollAnimation delay={0.2}>
          {hasEnoughItems ? (
            <div className="mt-12 relative">
              {/* Gradient masks for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <TooltipProvider>
                <InfiniteSlider gap={48} speed={30} speedOnHover={15}>
                  {section.items?.map((item, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                          <LazyImage
                            className="h-8 w-auto dark:invert"
                            src={item.image?.src ?? ''}
                            alt={item.image?.alt ?? ''}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.title || item.image?.alt}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </InfiniteSlider>
              </TooltipProvider>
            </div>
          ) : (
            <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
              {section.items?.map((item, idx) => (
                <LazyImage
                  key={idx}
                  className="h-8 w-fit dark:invert grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                  src={item.image?.src ?? ''}
                  alt={item.image?.alt ?? ''}
                />
              ))}
            </div>
          )}
        </ScrollAnimation>
      </div>
    </section>
  );
}
