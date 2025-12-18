'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

function ComparisonCard({
  title,
  description,
  before,
  after,
}: {
  title?: string;
  description?: string;
  before: { src: string; alt?: string; label?: string };
  after: { src: string; alt?: string; label?: string };
}) {
  const [value, setValue] = useState(50); // 0 => before only, 100 => after only
  const beforeWidth = 100 - value;

  return (
    <div className="flex flex-col h-full">
      {/* Large comparison container with enhanced visual impact */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-muted shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* 4:3 aspect ratio for better image visibility */}
        <div className="relative aspect-[4/3] w-full">
          {/* After image (base layer) */}
          <Image
            src={after.src}
            alt={after.alt ?? after.label ?? 'After'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover"
            priority={false}
          />

          {/* Before image (overlay with clip) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${beforeWidth}%` }}
          >
            <Image
              src={before.src}
              alt={before.alt ?? before.label ?? 'Before'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Enhanced divider line with larger handle for touch */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10"
            style={{ left: `${beforeWidth}%` }}
          >
            <div className="h-full w-1 -translate-x-1/2 bg-white shadow-lg" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl ring-2 ring-black/10">
              <div className="flex items-center gap-0.5">
                <div className="h-4 w-0.5 rounded-full bg-black/30" />
                <div className="h-4 w-0.5 rounded-full bg-black/30" />
              </div>
            </div>
          </div>

          {/* Labels with better visibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4">
            <span className="rounded-full bg-black/70 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              {before.label ?? 'Before'}
            </span>
            <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
              {after.label ?? 'After'}
            </span>
          </div>

          {/* Invisible range input for interaction - larger touch target */}
          <input
            aria-label="Compare images"
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0 touch-manipulation"
          />
        </div>
      </div>

      {/* Title and description below image */}
      <div className="mt-4 text-center">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

export function ImageComparison({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const items = section.items ?? [];

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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {items.map((item, index) => {
            const before = (item as any).before as
              | { src: string; alt?: string; label?: string }
              | undefined;
            const after = (item as any).after as
              | { src: string; alt?: string; label?: string }
              | undefined;

            if (!before?.src || !after?.src) {
              return null;
            }

            return (
              <motion.div
                key={`${item.title ?? 'comparison'}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <ComparisonCard
                  title={item.title}
                  description={item.description}
                  before={before}
                  after={after}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

