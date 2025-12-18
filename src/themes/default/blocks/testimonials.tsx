'use client';

import { LazyImage } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section, SectionItem } from '@/shared/types/blocks/landing';

export function Testimonials({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const TestimonialCard = ({ item }: { item: SectionItem }) => {
    return (
      <div className="group bg-card/25 ring-foreground/[0.07] flex flex-col justify-end gap-6 rounded-(--radius) border border-transparent p-8 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:bg-card/40">
        {/* Quote icon */}
        <div className="text-primary/20 text-4xl font-serif leading-none select-none">"</div>
        <p
          className='text-foreground text-balance -mt-4'
          dangerouslySetInnerHTML={{
            __html: item.quote || item.description || '',
          }}
        />
        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
          <div className="ring-foreground/10 aspect-square size-10 overflow-hidden rounded-full border border-transparent shadow-md ring-1 shadow-black/15 transition-transform duration-300 group-hover:scale-110">
            <LazyImage
              src={item.image?.src || item.avatar?.src || ''}
              alt={item.image?.alt || item.avatar?.alt || item.name || ''}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="sr-only">
            {item.name}, {item.role || item.title}
          </h3>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-muted-foreground text-xs">
              {item.role || item.title}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id={section.id}
      className={`py-16 md:py-24 ${section.className} ${className}`}
    >
      <div className="container">
        <ScrollAnimation>
          <div className="mx-auto max-w-2xl text-center text-balance">
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
          <div className="border-border/50 relative rounded-(--radius)">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-px lg:*:nth-1:rounded-t-none lg:*:nth-2:rounded-tl-none lg:*:nth-2:rounded-br-none lg:*:nth-3:rounded-l-none lg:*:nth-4:rounded-r-none lg:*:nth-5:rounded-tl-none lg:*:nth-5:rounded-br-none lg:*:nth-6:rounded-b-none">
              {section.items?.map((item, index) => (
                <TestimonialCard key={index} item={item} />
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
