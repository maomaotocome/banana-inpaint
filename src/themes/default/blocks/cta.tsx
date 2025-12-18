'use client';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function CTA({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24 relative overflow-hidden', section.className, className)}
    >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container relative z-10">
        <div className="text-center rounded-3xl bg-card/50 border border-border p-8 md:p-16 backdrop-blur-sm shadow-2xl">
          <ScrollAnimation>
            <h2 className="text-4xl font-bold text-balance lg:text-6xl drop-shadow-lg">
              {section.title}
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.15}>
            <p
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {section.buttons?.map((button, idx) => (
                <Button
                  asChild
                  size="lg"
                  variant={button.variant || 'default'}
                  key={idx}
                  className={cn(
                    "rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-black/20 hover:scale-105 transition-transform",
                    button.variant !== 'outline' && "shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  )}
                >
                  <Link
                    href={button.url || ''}
                    target={button.target || '_self'}
                  >
                    {button.icon && <SmartIcon name={button.icon as string} className="mr-2" />}
                    <span>{button.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
