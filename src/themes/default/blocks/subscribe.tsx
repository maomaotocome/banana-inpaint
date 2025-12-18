'use client';

import { useState, useMemo } from 'react';
import { Loader2, Mail, SendHorizonal, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import type { Section } from '@/shared/types/blocks/landing';

// Simple email validation
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function Subscribe({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const emailState = useMemo(() => {
    if (!email) return 'empty';
    if (isValidEmail(email)) return 'valid';
    return 'invalid';
  }, [email]);

  const handleSubscribe = async () => {
    if (emailState !== 'valid') {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!section.submit?.action) {
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch(section.submit.action, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      setLoading(false);
      setSubscribed(true);
      setEmail('');

      if (message) {
        toast.success(message);
      } else {
        toast.success('Successfully subscribed!');
      }

      // Reset success state after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || 'Subscribe failed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <ScrollAnimation>
            <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
              {section.title}
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.15}>
            <p
              className="mt-4 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
            <div className="mx-auto mt-10 max-w-xl overflow-hidden lg:mt-12">
              <div
                className={cn(
                  'bg-background relative grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 transition-all duration-300',
                  emailState === 'valid' && 'ring-2 ring-green-500/30 border-green-500/50',
                  emailState === 'invalid' && email.length > 3 && 'ring-2 ring-destructive/30 border-destructive/50',
                  emailState === 'empty' && 'has-[input:focus]:ring-2 has-[input:focus]:ring-muted'
                )}
              >
                <div className="pointer-events-none absolute inset-y-0 left-5 my-auto flex items-center">
                  {subscribed ? (
                    <CheckCircle2 className="size-5 text-green-500" />
                  ) : (
                    <Mail
                      className={cn(
                        'size-5 transition-colors',
                        emailState === 'valid' ? 'text-green-500' : 'text-muted-foreground'
                      )}
                    />
                  )}
                </div>

                <input
                  placeholder={
                    subscribed
                      ? 'Thank you for subscribing!'
                      : section.submit?.input?.placeholder || 'Enter your email'
                  }
                  className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={emailState === 'invalid'}
                  aria-describedby="email-error"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={subscribed}
                />

                {section.submit?.button && (
                  <div className="md:pr-1.5 lg:pr-0">
                    <Button
                      aria-label="submit"
                      className={cn(
                        'rounded-(--radius) transition-all',
                        emailState === 'valid' && 'bg-green-600 hover:bg-green-700'
                      )}
                      onClick={handleSubscribe}
                      disabled={loading || subscribed || emailState !== 'valid'}
                      type="submit"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : subscribed ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <span className="hidden md:block">
                          {section.submit.button.title}
                        </span>
                      )}
                      {!loading && !subscribed && (
                        <SendHorizonal
                          className="relative mx-auto size-5 md:hidden"
                          strokeWidth={2}
                        />
                      )}
                    </Button>
                  </div>
                )}
              </div>
              {/* Validation hint */}
              {emailState === 'invalid' && email.length > 3 && (
                <p className="mt-2 text-sm text-destructive text-center">
                  Please enter a valid email address
                </p>
              )}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
