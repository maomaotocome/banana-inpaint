'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeProgress
      );

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// Helper to parse stat value and extract number
export function parseStatValue(value: string): {
  number: number | null;
  prefix: string;
  suffix: string;
  isNumeric: boolean;
} {
  // Match patterns like "100+", "24/7", "10k+", "$99", "New"
  const match = value.match(/^([^\d]*)(\d+(?:[,.]?\d+)?)([^\d]*)$/);

  if (match) {
    const [, prefix, numStr, suffix] = match;
    const number = parseInt(numStr.replace(/[,\.]/g, ''), 10);
    return { number, prefix, suffix, isNumeric: true };
  }

  return { number: null, prefix: '', suffix: '', isNumeric: false };
}
