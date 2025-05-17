import { FC, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useTime } from 'framer-motion';
import Image from 'next/image';

interface ParallaxBackgroundProps {
    images: Array<{
        src: string;
        alt: string;
        position: 'left' | 'right' | 'center';
        speed: number;
        opacity?: number;
        width?: number;
        height?: number;
        top?: string;
        className?: string;
    }>;
}

const ParallaxBackground: FC<ParallaxBackgroundProps> = ({ images }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const time = useTime();

    return (
        <div ref={ref} className="relative h-full w-full overflow-hidden">
            {images.map((image, index) => {
                // Variación de fase basada en el índice para aleatorizar el movimiento
                const phaseOffset = index * 1000; // 500ms de diferencia entre cada uno

                // Parallax vertical base
                const yParallax = useTransform(
                    scrollYProgress,
                    [0, 1],
                    [0, -image.speed * 25]
                );

                // Standby vertical con fase desplazada para cada imagen
                const standbyY = useTransform(
                    time,
                    t => Math.sin((t + phaseOffset) / 1200) * 5
                );

                // Standby rotacional con fase desplazada
                const standbyRotate = useTransform(
                    time,
                    t => Math.sin((t + phaseOffset) / 1500) * 5
                );

                // Combinar movimientos
                const combinedY = useTransform(
                    [yParallax, standbyY],
                    ([parallax, standby]: any) => parallax + standby
                );

                const ySmooth = useSpring(combinedY, {
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                });

                let positionClass = "left-1/2 -translate-x-1/2";
                if (image.position === 'left') {
                    positionClass = "left-4";
                } else if (image.position === 'right') {
                    positionClass = "right-4";
                }

                const topPosition = image.top || `${(index * 15) + 10}%`;

                return (
                    <motion.div
                        key={index}
                        className={`absolute ${positionClass} ${image.className || ''}`}
                        style={{
                            y: ySmooth,
                            rotate: standbyRotate,
                            top: topPosition,
                            //opacity: image.opacity ?? 0.7,
                            zIndex: index
                        }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width || 150}
                            height={image.height || 150}
                            className="object-contain"
                            aria-hidden="true"
                            role="presentation"
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ParallaxBackground;
