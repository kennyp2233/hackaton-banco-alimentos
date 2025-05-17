import { FC, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ParallaxBackgroundProps {
    images: Array<{
        src: string;
        alt: string;
        position: 'left' | 'right' | 'center';
        speed: number;
    }>;
}

const ParallaxBackground: FC<ParallaxBackgroundProps> = ({ images }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    return (
        <div ref={ref} className="relative h-full w-full overflow-hidden">
            {/* Overlay to ensure readability of foreground content */}
            <div className="absolute inset-0 bg-white/70 z-10" />

            {/* Parallax images */}
            {images.map((image, index) => {
                // Calculate transform based on position and speed
                const yTransform = useTransform(
                    scrollYProgress,
                    [0, 1],
                    [0, image.speed * 100]
                );

                // Define positioning classes based on the image position
                let positionClass = "left-1/2 -translate-x-1/2"; // default center
                if (image.position === 'left') {
                    positionClass = "left-0";
                } else if (image.position === 'right') {
                    positionClass = "right-0";
                }

                return (
                    <motion.div
                        key={index}
                        className={`absolute ${positionClass} z-0`}
                        style={{
                            y: yTransform,
                            opacity: 0.7,
                            top: `${(index * 20) + 10}%`,
                        }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={300}
                            height={300}
                            className="object-contain"
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ParallaxBackground;