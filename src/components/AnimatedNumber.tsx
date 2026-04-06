import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../utils/format";

type Props = {
  value: number;
  className?: string;
};

export const AnimatedNumber = ({ value, className }: Props) => {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const end = value;
    const duration = 500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const current = start + (end - start) * progress;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    previous.current = value;
  }, [value]);

  return <span className={className}>{formatNumber(display)}</span>;
};
