import { motion, MotionProps } from "framer-motion";
import { HTMLAttributes } from "react";
import useMeasure from "react-use-measure";
type Props = {
  children: React.ReactNode;
  containerStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  startAnimation?: boolean;
} & HTMLAttributes<HTMLDivElement> &
  MotionProps;
const HeightAnimationWrapper = ({
  children,
  containerStyle,
  wrapperStyle,
  startAnimation = true,
  ...props
}: Props) => {
  const [ref, { height }] = useMeasure();
  return (
    <motion.div
      {...props}
      animate={startAnimation ? { height: height + 15 } : undefined}
      transition={{
        duration: 0.25,
      }}
      style={{
        overflow: "hidden",
        ...containerStyle,
      }}
    >
      <div
        ref={ref}
        style={{ overflow: "hidden", paddingBottom: 10, ...wrapperStyle }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default HeightAnimationWrapper;
