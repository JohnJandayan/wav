import { motion, useMotionValue, useSpring, type MotionStyle } from 'framer-motion';
import { useEffect, useState, type ReactNode, type PointerEvent } from 'react';
import { useExperience } from '../hooks/Experience';
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { motionOff } = useExperience();
  return (
    <motion.div
      className={className}
      initial={motionOff ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { motionOff } = useExperience();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotX = useMotionValue('50%');
  const spotY = useMotionValue('50%');
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (motionOff || !fine) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    x.set((0.5 - py) * 5);
    y.set((px - 0.5) * 5);
    spotX.set(`${px * 100}%`);
    spotY.set(`${py * 100}%`);
  };
  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={
        {
          rotateX: motionOff ? 0 : rotateX,
          rotateY: motionOff ? 0 : rotateY,
          '--spot-x': spotX,
          '--spot-y': spotY,
        } as MotionStyle
      }
    >
      {children}
    </motion.div>
  );
}
export function MagneticLink({
  children,
  href,
  className = '',
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const { motionOff } = useExperience();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 22 });
  const springY = useSpring(y, { stiffness: 250, damping: 22 });
  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: motionOff ? 0 : springX, y: motionOff ? 0 : springY }}
      onPointerMove={(event) => {
        if (motionOff || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}
