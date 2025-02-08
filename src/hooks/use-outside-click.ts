import type React from "react";
import { useEffect, useRef } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
  ref: React.RefObject<T>,
  handler: Handler,
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      savedHandler.current(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
};
