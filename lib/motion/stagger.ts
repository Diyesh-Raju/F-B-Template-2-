export function stagger({
  staggerChildren = 0.08,
  delayChildren = 0.04,
}: {
  staggerChildren?: number;
  delayChildren?: number;
}) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  } as const;
}

