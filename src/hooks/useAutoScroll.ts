import { RefObject, useEffect } from "react";

export const useAutoScroll = (ref: RefObject<HTMLElement>, enabled = true) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let direction: "down" | "up" = "down";
    let pause = false;
    let pauseUntil = 0;

    const step = (ts: number) => {
      if (!el) return;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (pause) {
        if (ts > pauseUntil) pause = false;
      } else if (direction === "down") {
        el.scrollTop += 0.45;
        if (el.scrollTop >= maxScroll) {
          pause = true;
          pauseUntil = ts + 1400;
          direction = "up";
        }
      } else {
        el.scrollTop -= 0.45;
        if (el.scrollTop <= 0) {
          pause = true;
          pauseUntil = ts + 1200;
          direction = "down";
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
};
