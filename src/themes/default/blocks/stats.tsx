'use client';

import { CountUp, parseStatValue } from '@/shared/components/ui/count-up';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section } from '@/shared/types/blocks/landing';

function StatValue({ value }: { value: string }) {
  const parsed = parseStatValue(value);

  if (parsed.isNumeric && parsed.number !== null) {
    return (
      <CountUp
        end={parsed.number}
        prefix={parsed.prefix}
        suffix={parsed.suffix}
        duration={2000}
      />
    );
  }

  // For non-numeric values like "New" or "24/7"
  return <span>{value}</span>;
}

export function Stats({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={`py-12 md:py-24 ${section.className} ${className}`}
    >
      <div className={`container space-y-8 md:space-y-16`}>
        <ScrollAnimation>
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p
              className="text-muted-foreground mb-6 md:mb-12 lg:mb-16"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="grid gap-6 md:grid-cols-4 md:gap-4">
            {section.items?.map((item, idx) => (
              <div
                className="group relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
                key={idx}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>
                <div className="relative z-10">
                  <div className="text-primary text-4xl md:text-5xl font-bold mb-2 transition-transform duration-300 group-hover:scale-110">
                    <StatValue value={item.title || ''} />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
