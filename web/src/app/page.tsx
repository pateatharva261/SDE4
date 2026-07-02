'use client';

import * as React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useHasMounted } from '@/hooks/useHasMounted';
import { buildFlatList, getFirstIncompleteLesson } from '@/lib/curriculum';
import { COURSE } from '@/data/manifest';
import { PartBadge } from '@/components/shared/PartBadge';
import { Play, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { staggerParent, staggerChild } from '@/lib/motion';

export default function Dashboard() {
  const { completed } = useProgress();
  const mounted = useHasMounted();
  const router = useRouter();

  const lessons = React.useMemo(() => {
    return buildFlatList().filter((i) => i.kind === 'lesson');
  }, []);

  const totalLessons = lessons.length;
  const completedLessons = mounted ? lessons.filter((l) => completed[l.id]).length : 0;
  const overallPercentage = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find first incomplete lesson URL
  const resumeUrl = React.useMemo(() => {
    if (!mounted) return '#';
    const nextLesson = getFirstIncompleteLesson(completed);
    return nextLesson ? nextLesson.url : '#';
  }, [completed, mounted]);

  // SVG circular progress ring variables
  const radius = 48;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  const handlePartClick = (p: typeof COURSE.parts[0]) => {
    const firstLesson = p.modules[0]?.lessons[0];
    if (firstLesson) {
      const slug = firstLesson.path.replace(/^lessons\//, '').replace(/\.md$/, '');
      router.push(`/learn/${slug}`);
    } else {
      toast.info(`Part ${p.num} is planned and will be released in a future update.`);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerParent}
      className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10"
    >
      {/* 1. Hero / Progress Summary Widget */}
      <motion.div
        variants={staggerChild}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-bg-elev/30 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
      >
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text">
              System Design Mastery
            </h1>
            <p className="text-[13.5px] text-text-dim max-w-md leading-relaxed font-medium">
              From senior engineer to Staff/Principal architect. Master scalability, resilience, and trade-offs.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={resumeUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm transition-all hover:bg-accent-2 hover:scale-[1.02] active:scale-95 shadow-md shadow-accent/20 hover:shadow-accent-2/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {completedLessons > 0 ? 'Resume learning' : 'Start learning'}
            </Link>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex flex-col items-center gap-2 shrink-0 md:pr-4 select-none">
          <div className="relative w-[120px] h-[120px]">
            <svg className="w-full h-full -rotate-90">
              {/* Outer Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-border/40"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-accent"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: mounted ? strokeDashoffset : circumference }}
                transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.1 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text font-mono leading-none">
                {overallPercentage}%
              </span>
              <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider mt-1 font-bold">
                Done
              </span>
            </div>
          </div>
          <span className="text-[12px] font-mono text-text-dim mt-1">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
      </motion.div>

      {/* 2. Parts Grid Title */}
      <motion.div variants={staggerChild} className="space-y-1">
        <h2 className="text-lg font-bold text-text flex items-center gap-2 tracking-tight">
          <Layers className="w-4 h-4 text-accent" />
          Curriculum Chapters
        </h2>
        <p className="text-xs text-text-dim">
          Select a chapter card to browse modules and dive into interactive labs.
        </p>
      </motion.div>

      {/* 3. Chapters Grid */}
      <motion.div
        variants={staggerChild}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {COURSE.parts.map((p) => {
          // Calculate lessons completed for this part
          const partLessons: Array<{ id: string; title: string; path: string }> = [];
          p.modules.forEach((m) => {
            m.lessons.forEach((l) => partLessons.push(l));
          });
          const partTotal = partLessons.length;
          const partDone = mounted ? partLessons.filter((l) => completed[l.id]).length : 0;
          const partPct = partTotal ? Math.round((partDone / partTotal) * 100) : 0;

          const hasLessons = partTotal > 0;

          return (
            <motion.div
              key={p.id}
              onClick={() => handlePartClick(p)}
              className={`group flex flex-col justify-between border border-border/30 rounded-xl p-4.5 bg-bg-elev/15 hover:bg-bg-elev/45 hover:border-border/80 transition-all duration-200 cursor-pointer shadow-xs select-none ${
                !hasLessons ? 'opacity-85' : ''
              }`}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase">
                    Part {p.num}
                  </span>
                  <PartBadge status={p.status} />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="font-bold text-[14px] text-text leading-tight group-hover:text-accent transition-colors duration-150">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-text-dim">
                    <span>{p.modules.length} modules</span>
                    {hasLessons && (
                      <>
                        <span>·</span>
                        <span>{partTotal} lessons</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress details */}
              {hasLessons ? (
                <div className="mt-5 space-y-1.5 pt-2 border-t border-border/10">
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-text-dim">
                    <span>Part Complete</span>
                    <span className="font-semibold text-text">{partPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-elev2 rounded-full overflow-hidden border border-border/10">
                    <div
                      className="h-full bg-accent transition-all duration-300 rounded-full"
                      style={{ width: `${partPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5 text-[11px] italic text-text-dim/80 pt-2 border-t border-border/10">
                  {p.status === 'in-progress'
                    ? 'Writing lessons...'
                    : 'Curriculum map only.'}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// Inline custom toast helper to avoid imports from React dependencies
const toast = {
  info: (msg: string) => {
    import('sonner').then(({ toast: sonnerToast }) => {
      sonnerToast.info(msg);
    });
  },
};
