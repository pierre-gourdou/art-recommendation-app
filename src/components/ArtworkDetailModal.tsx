'use client';

import { Artwork } from '@/types/artwork';
import { parseGenres, getGenreColor } from '@/utils/genreColors';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export default function ArtworkDetailModal({ artwork, onClose }: ArtworkDetailModalProps) {
  if (!artwork) return null;

  const imageUrl = `https://artwork-portfolio-project.s3.eu-north-1.amazonaws.com/${artwork.id}.jpg`;

  return (
    <div 
      className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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

          <div className="p-8">
            <img
              src={imageUrl}
              alt={artwork.description}
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
            />
            
            <div className="mt-6 space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  {artwork.artist}
                </h2>
                <p className="text-lg text-gray-600 capitalize">
                  {artwork.description.replace(/-/g, ' ')}
                </p>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {parseGenres(artwork.genre).map((genre, idx) => (
                    <span
                      key={idx}
                      className={`text-sm px-3 py-1 rounded-full border font-medium ${getGenreColor(genre)}`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
