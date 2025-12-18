'use client';

import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Text({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container">
        <ScrollAnimation>
          <div className="mx-auto max-w-4xl">
            {section.label && (
              <p className="text-muted-foreground mb-3 text-sm font-medium text-center">
                {section.label}
              </p>
            )}
            <h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight md:text-4xl text-center">
              {section.title}
            </h2>
            <div
              className="text-muted-foreground text-base leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}