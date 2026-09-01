'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';

interface GalleryLightboxProps {
  images: string[];
  videoUrl?: string;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryLightbox({
  images,
  videoUrl,
  initialIndex = 0,
  isOpen,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setShowVideo(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setShowVideo(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            {showVideo ? 'Video Tour' : `${currentIndex + 1} / ${images.length}`}
          </span>
          {videoUrl && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                showVideo
                  ? 'bg-amber-400 text-zinc-950 border-amber-400'
                  : 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{showVideo ? 'Show Gallery' : 'Watch Video Tour'}</span>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Main Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4">
        {showVideo ? (
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Luxury Property Video Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Navigation Arrows */}
        {!showVideo && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white border border-white/10 backdrop-blur-md transition transform hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white border border-white/10 backdrop-blur-md transition transform hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 max-w-4xl mx-auto">
        {images.map((img, idx) => (
          <button
            key={img + idx}
            onClick={() => {
              setCurrentIndex(idx);
              setShowVideo(false);
            }}
            className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
              currentIndex === idx && !showVideo
                ? 'border-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
