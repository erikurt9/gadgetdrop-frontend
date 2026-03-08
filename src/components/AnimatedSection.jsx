import { motion } from "framer-motion"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export function AnimatedSection({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, visible] = useScrollAnimation()

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}