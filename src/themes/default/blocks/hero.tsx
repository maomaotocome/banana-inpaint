'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Highlighter } from '@/shared/components/ui/highlighter';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { SocialAvatars } from './social-avatars';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleGenerate = () => {
    if (prompt.trim()) {
      router.push(`/nanobanana-ai-image-generator?prompt=${encodeURIComponent(prompt.trim())}`);
    } else {
      router.push('/nanobanana-ai-image-generator');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handlePromptHint = (hint: string) => {
    setPrompt(hint);
  };
  const highlightText = section.highlight_text ?? '';
  let texts = null;
  if (highlightText) {
    texts = section.title?.split(highlightText, 2);
  }

  return (
    <section
      id={section.id}
      className={cn(
        `relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden`,
        section.className,
        className
      )}
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="hover:bg-white/5 border-white/10 dark:border-white/10 bg-white/5 group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-lg shadow-primary/5 transition-all duration-300 backdrop-blur-sm"
        >
          <span className="text-foreground/80 text-sm font-medium">
            {section.announcement.title}
          </span>
          <span className="block h-4 w-0.5 border-l border-white/20"></span>

          <div className="bg-primary/10 group-hover:bg-primary/20 size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
               <span className="flex size-6 items-center justify-center">
                <ArrowRight className="size-3 text-primary" />
              </span>
              <span className="flex size-6 items-center justify-center">
                <ArrowRight className="size-3 text-primary" />
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-5xl z-10">
        {texts && texts.length > 0 ? (
          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-8 sm:text-7xl drop-shadow-sm">
            {texts[0]}
            <Highlighter action="underline" color="oklch(0.85 0.18 95)">
              {highlightText}
            </Highlighter>
            {texts[1]}
          </h1>
        ) : (
          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-8 sm:text-7xl drop-shadow-sm">
            {section.title}
          </h1>
        )}

        <p
          className="text-muted-foreground mt-6 mb-10 text-lg sm:text-xl text-balance max-w-3xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
        />

        {/* Command Center Input */}
        {section.prompt_input && (
          <div className="mx-auto mt-8 max-w-2xl relative group z-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-50 blur-md group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center bg-background/80 dark:bg-secondary/80 rounded-full p-1.5 ring-1 ring-border backdrop-blur-2xl shadow-2xl">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={section.prompt_input.placeholder || "Describe your imagination..."}
                className="w-full bg-transparent border-none outline-none text-foreground px-6 py-4 text-base sm:text-lg placeholder:text-muted-foreground focus:ring-0 font-medium"
              />
              <Button
                size="lg"
                onClick={handleGenerate}
                className="rounded-full bg-primary text-primary-foreground tracking-wide font-bold hover:bg-primary/90 px-6 sm:px-8 py-6 shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all hover:scale-105 active:scale-95"
              >
                <SmartIcon name="sparkles" className="mr-2 size-5" />
                {section.prompt_input.button || "Generate"}
              </Button>
            </div>
            {/* Prompt Hints */}
            {section.prompt_input.hints && section.prompt_input.hints.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                {section.prompt_input.hints.map((hint: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptHint(hint)}
                    className="px-3 py-1 rounded-full bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted cursor-pointer transition duration-300"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {section.buttons && (
          <div className="flex items-center justify-center gap-4 mt-10 opacity-80 hover:opacity-100 transition-opacity">
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size="sm"
                variant={button.variant || 'ghost'}
                className="px-4 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground"
                key={idx}
              >
                <Link href={button.url ?? ''} target={button.target ?? '_self'}>
                  {button.icon && <SmartIcon name={button.icon as string} />}
                  <span>{button.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {section.tip && (
          <p
            className="text-muted-foreground mt-6 block text-center text-sm"
            dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
          />
        )}

        {section.show_avatars && (
          <SocialAvatars tip={section.avatars_tip || ''} />
        )}
      </div>

     {section.image && (
        <div className="relative mt-16 sm:mt-24 w-full">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50"></div>
          <div className="relative z-10 mx-auto max-w-6xl px-4">
             <div className="relative group rounded-2xl border border-white/10 bg-zinc-900/50 p-2 backdrop-blur-sm shadow-2xl shadow-black/50">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="relative overflow-hidden rounded-xl">
                 {(section.image_invert?.src || section.image?.src) && (
                <Image
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={section.image_invert?.src || section.image?.src || ''}
                  alt={section.image_invert?.alt || section.image?.alt || ''}
                  width={section.image_invert?.width || section.image?.width || 1200}
                  height={section.image_invert?.height || section.image?.height || 630}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={85}
                />
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {section.background_image && (
        <div className="absolute inset-0 -z-10 hidden h-full w-full overflow-hidden md:block select-none pointer-events-none">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-background via-background/90 to-background" />
          <Image
            src={section.background_image?.src || ''}
            alt={section.background_image?.alt || ''}
            className="object-cover opacity-30"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 0vw, 100vw"
            quality={70}
          />
        </div>
      )}
    </section>
  );
}
