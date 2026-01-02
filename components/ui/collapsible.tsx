"use client"

import * as React from "react"
import { motion } from "framer-motion"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

const AnimatedCollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
    isOpen: boolean
    animate?: boolean
  }
>(({ isOpen, animate = true, children, className, ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent forceMount asChild {...props}>
      <motion.div
        ref={ref}
        initial={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={animate ? { duration: 0.2, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
        className={className}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.div>
    </CollapsiblePrimitive.CollapsibleContent>
  )
})

AnimatedCollapsibleContent.displayName = "AnimatedCollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent, AnimatedCollapsibleContent }
