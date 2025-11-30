import { type HTMLAttributes, type ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";

type Props = {
  children: ReactNode;
  animateDelay?: number;
  endOpacity?: number;
  exitDelay?: number;
  animateDuration?: number;
  exitDuration?: number;
  duration?: number;
  enableScaleAnimation?: boolean;
} & HTMLAttributes<HTMLDivElement> &
  MotionProps;
const FadeInWrapperAnimation = ({
  children,
  duration = 0.15,
  animateDelay,
  endOpacity = 1,
  exitDelay,
  animateDuration,
  exitDuration,
  enableScaleAnimation = true,

  ...props
}: Props) => {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, scale: enableScaleAnimation ? 0.75 : 1 }}
      animate={{
        opacity: [0, 0.5, endOpacity],
        scale: enableScaleAnimation ? [0.75, 1] : 1,
        transition: {
          duration: animateDuration || duration / 2,
          delay: animateDelay || duration / 2,
          ease: "linear",
        },
      }}
      exit={{
        opacity: 0,
        scale: enableScaleAnimation ? 0.75 : 1,
        transition: {
          duration: exitDuration || duration / 2,
          delay: exitDelay || 0,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWrapperAnimation;
