import { motion } from 'framer-motion';

export default function InteractiveText({ text, className = "" }) {
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hover: {
            y: -5,
            color: "#00f3ff",
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 400,
            }
        }
    };

    return (
        <motion.div
            className={`flex overflow-hidden cursor-default ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    whileHover="hover"
                    className="inline-block"
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}
