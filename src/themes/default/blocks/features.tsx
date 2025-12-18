'use client';

import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Features({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24 relative', section.className, className)}
    >
      <div className="container space-y-12">
        <ScrollAnimation>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
          <div className="mx-auto max-w-3xl text-center text-balance">
            <h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {section.items?.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "relative group overflow-hidden rounded-2xl p-6 md:p-8 border border-border bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-primary/5 transition duration-500",
                  idx === 0 || idx === 3 ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition duration-500"></div>

                <div className="relative z-10 flex flex-col h-full min-h-[180px]">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-muted border border-border group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                      <SmartIcon name={item.icon as string} size={24} />
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
