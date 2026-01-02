"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardGridProps {
  children: React.ReactNode
  className?: string
  animationKey?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export function AnimatedCardGrid({ children, className, animationKey }: AnimatedCardGridProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {childrenArray.map((child, index) => (
          <motion.div
            key={`${animationKey}-${index}`}
            variants={itemVariants}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
