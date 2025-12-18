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
          <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
            {section.items?.map((item, idx) => (
              <div className="space-y-4 group" key={idx}>
                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>
                <div className="text-primary text-5xl font-bold transition-transform duration-300 group-hover:scale-110">
                  <StatValue value={item.title || ''} />
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
