import { motion } from "framer-motion";
import { Typography } from "antd";
import { useLanguage } from "../../../../context/language";

type Props = {
  shouldAnimate: boolean;
  label: string;
  hasError?: boolean;
};

const labelVariants = {
  initial: {
    top: "30%",

    transform: "translate(0, -50%) scale(1)",
  },
  animate: {
    top: "-5px",
    transform: `translate(0, -50%) scale(.75)`,
  },
};
const Label = ({ label, shouldAnimate, hasError }: Props) => {
  const { isEnglish } = useLanguage();
  const getColor = (): string => {
    if (hasError) return "#DB4437";
    if (shouldAnimate) return "#0F9D58";
    return "grey";
  };
  return (
    <motion.label
      className="label"
      style={{
        left: isEnglish ? 0 : "initial",
        right: !isEnglish ? 0 : "initial",
        transformOrigin: isEnglish ? "left 0" : "right 0",
        color: getColor(),
      }}
      variants={labelVariants}
      initial={false}
      animate={shouldAnimate ? "animate" : "initial"}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <>{label}</>
    </motion.label>
  );
};

export default Label;
