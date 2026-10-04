import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import "./styles/PageTransition.css";

// Give exactly 1 instance to be accessed globally
let globalTransitionFn: ((url: string, newTab?: boolean) => void) | null = null;

export const transitionTo = (url: string, newTab: boolean = false) => {
  if (globalTransitionFn) {
    globalTransitionFn(url, newTab);
  } else {
    // Fallback if not mounted
    if (newTab) window.open(url, "_blank");
    else window.location.href = url;
  }
};

const PageTransition = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const playTransition = useCallback((url: string, newTab: boolean = false) => {
    if (!panelRef.current || !textRef.current || !overlayRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (newTab) {
          window.open(url, "_blank");
          // Immediately reverse the timeline so the portfolio is waiting for them when they come back
          tl.reverse();
        } else {
          // Normal redirect
          window.location.href = url;
        }
      },
    });

    // Make overlay capture clicks so user can't spam
    overlayRef.current.style.pointerEvents = "all";

    // 1. Wipe panel up securely
    tl.to(panelRef.current, {
      y: "0%",
      duration: 0.6,
      ease: "power3.inOut",
    });

    // 2. Fade text in
    tl.to(
      textRef.current,
      {
        opacity: 1,
        y: -20,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // 3. Briefly hold for effect
    tl.to({}, { duration: 0.3 });

    // Ensure we reset pointer events on reverse
    tl.eventCallback("onReverseComplete", () => {
      if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
    });
  }, []);

  useEffect(() => {
    // Register the global function
    globalTransitionFn = playTransition;
    return () => {
      globalTransitionFn = null;
    };
  }, [playTransition]);

  return (
    <div className="page-transition-overlay" ref={overlayRef}>
      <div className="transition-panel" ref={panelRef}></div>
      <div className="transition-text" ref={textRef} style={{ transform: "translateY(20px)" }}>
        TANIYA NAUTIYAL
      </div>
    </div>
  );
};

export default PageTransition;
