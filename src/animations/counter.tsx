import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CounterProps {
  to: number;
  duration?: number;

  format?: (value: number) => string;
}

export const CounterAnimation = ({
  to,
  duration = 800,
  format = (value) => value.toString(),
}: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = to;
    const startTime = performance.now();

    const totalSteps = Math.abs(end - start);
    if (totalSteps === 0) return;

    const stepValue = 1;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Clamp between 0 and 1
      const current = Math.round(start + stepValue * totalSteps * progress);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(end); // Ensure exact target value
      }
    };

    const animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={count}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.2,
        }}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {format(count)}
      </motion.span>
    </AnimatePresence>
  );
};
