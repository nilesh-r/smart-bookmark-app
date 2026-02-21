
'use client';

import { motion } from 'framer-motion';

export default function AnimatedArrow() {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.div
                initial={{ x: '-100vw', opacity: 0 }}
                animate={{ x: '100vw', opacity: [0, 1, 1, 0] }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    times: [0, 0.1, 0.9, 1]
                }}
                className="absolute w-full h-32 flex items-center"
            >
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary transform rotate-0 drop-shadow-[0_0_10px_rgba(236,29,36,0.8)]">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
