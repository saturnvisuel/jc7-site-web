"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  once?: boolean;
}

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      // Seuil en pixels plutôt qu'en ratio : un bloc plus haut que l'écran
      // (cas fréquent sur mobile) n'atteint jamais 15 % de visibilité.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    // Filet de sécurité : le contenu ne doit jamais rester masqué, même si
    // l'observer ne se déclenche pas (navigateur exotique, onglet restauré...).
    const fallback = window.setTimeout(() => setVisible(true), 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", HIDDEN_TRANSFORM[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}
