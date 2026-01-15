'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface SwipeCardProps {
  imageUrl: string;
  onLike: () => void;
  onDislike: () => void;
}

export default function SwipeCard({ imageUrl, onLike, onDislike }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onLike();
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onDislike();
    }
  };

  const handleLike = () => {
    setExitX(200);
    onLike();
  };

  const handleDislike = () => {
    setExitX(-200);
    onDislike();
  };

  return (
    <div className="relative w-full max-w-md h-[600px] flex flex-col items-center justify-center">
      <motion.div
        className="w-full h-[500px] bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden"
        style={{
          x,
          rotate,
          opacity,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={exitX !== 0 ? { x: exitX * 2, opacity: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="w-full h-full relative p-4">
          <img
            src={imageUrl}
            alt="Art"
            className="w-full h-full object-contain"
          />
          
          {/* Like overlay */}
          <motion.div
            className="absolute top-10 right-10 border-4 border-green-500 text-green-500 font-bold text-4xl px-6 py-3 rounded-lg rotate-[20deg]"
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
          >
            LIKE
          </motion.div>

          {/* Dislike overlay */}
          <motion.div
            className="absolute top-10 left-10 border-4 border-red-500 text-red-500 font-bold text-4xl px-6 py-3 rounded-lg rotate-[-20deg]"
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
          >
            NOPE
          </motion.div>
        </div>
      </motion.div>

      {/* Action buttons below card */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleDislike}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <button
          onClick={handleLike}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <svg
            className="w-8 h-8 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
