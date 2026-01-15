'use client';

import { Artwork } from '@/types/artwork';
import { parseGenres, getGenreColor } from '@/utils/genreColors';
import { motion } from 'framer-motion';

interface ArtworkGalleryProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function ArtworkGallery({ artworks, onArtworkClick }: ArtworkGalleryProps) {
  return (
    <div className="w-full">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {artworks.map((artwork, index) => {
          const imageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${artwork.id}.jpg`;
          console.log('Rendering artwork:', artwork.id, imageUrl);
          
          return (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="break-inside-avoid cursor-pointer group relative rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden"
              onClick={() => onArtworkClick(artwork)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-full min-h-[200px] bg-white p-4">
                <img
                  src={imageUrl}
                  alt={artwork.description}
                  className="w-full h-auto object-contain"
                  onLoad={(e) => {
                    console.log('Image loaded successfully:', artwork.id);
                    e.currentTarget.style.minHeight = 'auto';
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', artwork.id, imageUrl);
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-500 text-sm p-4">Failed to load image<br/>${artwork.id}</div>`;
                    }
                  }}
                />
              </div>
              <div className="p-3 bg-white border-t">
                <p className="font-semibold text-sm text-gray-800 truncate">{artwork.artist}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{artwork.description?.replace(/-/g, ' ')}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {parseGenres(artwork.genre).map((genre, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-0.5 rounded-full border ${getGenreColor(genre)}`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
