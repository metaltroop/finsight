import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const ScrollScale = ({ children, className = "" }) => {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center", "end start"]
    })

    // Smooth the scroll progress using spring physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Scale from 0.9 when at edge, to 1.0 when at center, back to 0.9 when leaving
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.93, 1, 0.93])

    // Opacity fade in and out - also smoothed
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])

    return (
        <motion.div
            ref={ref}
            style={{
                scale,
                opacity,
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default ScrollScale
