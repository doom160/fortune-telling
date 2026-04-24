"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function MethodologyModal({ isOpen, onClose, title, children }: MethodologyModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div className="methodology-overlay" onClick={onClose}>
      <div className="methodology-modal" onClick={(e) => e.stopPropagation()}>
        <div className="methodology-header">
          <h2>{title}</h2>
          <button className="methodology-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="methodology-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
