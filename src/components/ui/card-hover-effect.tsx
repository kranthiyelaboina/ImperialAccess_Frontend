import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type HoverEffectItem = {
  title: string
  description: string
  link?: string
  icon?: React.ReactNode
}

export function HoverEffect({
  items,
  className,
}: {
  items: HoverEffectItem[]
  className?: string
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`ea-hover-grid ${className || ''}`}>
      {items.map((item, idx) => {
        const Wrapper = item.link ? 'a' : 'div'
        const wrapperProps = item.link
          ? { href: item.link, target: '_blank' as const, rel: 'noopener noreferrer' }
          : {}

        return (
          <Wrapper
            key={idx}
            {...(wrapperProps as any)}
            className="ea-hover-card-link"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="ea-hover-card-glow"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
            </AnimatePresence>
            <div className="ea-hover-card">
              {item.icon && <div className="ea-hover-card-icon">{item.icon}</div>}
              <h4 className="ea-hover-card-title">{item.title}</h4>
              <p className="ea-hover-card-desc">{item.description}</p>
            </div>
          </Wrapper>
        )
      })}
    </div>
  )
}
