"use client";

import { Modal } from "@heroui/react";
import { Play } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/utils";

type Video = { src: string; poster: string };

/** Muted looping background video with a play button that opens the full clip in a modal. */
export function VideoPanel({ video, label, className }: { video: Video; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={cx("group relative overflow-hidden rounded-[2rem] bg-evergreen-950 shadow-2xl", className)}>
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03]"
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950/70 via-transparent to-evergreen-950/10" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex items-center justify-center outline-none"
          aria-label={label}
        >
          <span className="relative flex size-20 items-center justify-center rounded-full bg-cream-50/95 text-cranberry-700 shadow-2xl transition group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-gold-400">
            <span className="absolute inset-0 animate-ping rounded-full bg-cream-50/40" />
            <Play className="relative ml-1 size-8 fill-current" />
          </span>
        </button>
      </div>
      <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Modal.Container size="lg" placement="center">
          <Modal.Dialog className="overflow-hidden bg-black p-0 sm:max-w-4xl">
            <Modal.CloseTrigger className="z-10 bg-white/90" />
            <Modal.Body className="p-0">
              <video className="aspect-video w-full" src={video.src} poster={video.poster} controls autoPlay playsInline />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

