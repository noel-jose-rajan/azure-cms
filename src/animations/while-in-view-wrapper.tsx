import React, { HTMLAttributes, PropsWithChildren } from "react";
import { motion, MotionProps } from "framer-motion";
type Props = {
  once?: boolean;
} & PropsWithChildren &
  MotionProps &
  HTMLAttributes<HTMLDivElement>;
const WhileInViewWrapper = ({ once = true, children, ...props }: Props) => {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: [0, 1], y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
};

export default WhileInViewWrapper;
