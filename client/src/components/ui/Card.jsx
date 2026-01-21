import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card = ({ className, children, ...props }) => {
    return (
        <motion.div
            className={cn(
                "bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
