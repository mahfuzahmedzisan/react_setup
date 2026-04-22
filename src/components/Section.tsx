import { cn } from '@/lib/utils';
import { motion, type Easing } from 'motion/react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionVariant = 'default' | 'alternate' | 'light';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Background variant. default = py-16 only, alternate = bg-card, light = bg-background */
  variant?: SectionVariant;
  /** Animation: initial hidden state. Set false to disable animation entirely. */
  animated?: boolean;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Easing function */
  ease?: Easing;
  /** Stagger delay between direct children (seconds). 0 = no stagger. */
  stagger?: number;
  /** How much of the section must be visible before animating (0–1) */
  viewportAmount?: number;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  default: 'py-16 md:py-24',
  alternate: 'bg-card text-foreground py-16 md:py-24',
  light: 'bg-background py-16 md:py-24',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Section({
  children,
  className,
  id,
  variant = 'default',
  animated = true,
  delay = 0,
  duration = 0.5,
  ease = 'easeOut',
  stagger = 0,
  viewportAmount = 0.2,
}: SectionProps) {
  const baseClass = cn(VARIANT_CLASSES[variant], className);

  // Animation disabled — plain section
  if (!animated) {
    return (
      <section id={id} className={baseClass}>
        {children}
      </section>
    );
  }

  const hasStagger = stagger > 0;

  return (
    <motion.section
      id={id}
      className={baseClass}
      // Hidden state before entering viewport
      initial={{ opacity: 0, y: 24 }}
      // Animate when scrolled into view
      whileInView={{ opacity: 1, y: 0 }}
      // Don't replay on scroll back up
      viewport={{ once: true, amount: viewportAmount }}
      transition={
        hasStagger
          ? {
              duration,
              ease,
              delay,
              // When stagger > 0, children animate in sequence
              staggerChildren: stagger,
              delayChildren: delay,
            }
          : {
              duration,
              ease,
              delay,
            }
      }
    >
      {children}
    </motion.section>
  );
}

// ─── Convenience child wrapper for staggered items ───────────────────────────
// Wrap direct children with <Section.Item> to opt into stagger animation.

function SectionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

Section.Item = SectionItem;