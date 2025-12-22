import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const LoadPullEffect = ({ children, interval = 30000 }) => {
    const controls = useAnimation()

    const rubberbandSequence = async () => {
        await controls.start({
            y: [0, -40, 0],
            transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.4, 1]
            }
        })
    }

    useEffect(() => {
        // Initial animation
        const initialTimer = setTimeout(() => {
            if (window.scrollY < 50) {
                rubberbandSequence()
            }
        }, 800)

        // Loop at specified interval if at top
        const loopInterval = setInterval(() => {
            if (window.scrollY < 50) {
                rubberbandSequence()
            }
        }, interval)

        return () => {
            clearTimeout(initialTimer)
            clearInterval(loopInterval)
        }
    }, [controls, interval])

    return (
        <motion.div animate={controls}>
            {children}
        </motion.div>
    )
}

export default LoadPullEffect
