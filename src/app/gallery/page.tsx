'use client';

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import ArtworkGallery from '@/components/ArtworkGallery';
import ArtworkDetailModal from '@/components/ArtworkDetailModal';
import { Artwork } from '@/types/artwork';

// 1. Move all your logic into this new internal component
function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recommendedArtworks, setRecommendedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const likedIds = searchParams.get('liked');
      
      if (!likedIds) {
        setError('No liked artworks found');
        setIsLoading(false);
        return;
      }

      const ids = likedIds.split(',');
      const allRecommendations: Artwork[] = [];
      
      try {
        for (const id of ids) {
          const response = await fetch(`/api/recommend/${id}`);
          if (response.ok) {
            const data = await response.json();
            const recommendations = Array.isArray(data) ? data : data.recommendations || [];
            allRecommendations.push(...recommendations);
          }
        }
        
        const uniqueRecommendations = allRecommendations.filter(
          (artwork, index, self) => 
            index === self.findIndex((a) => a.id === artwork.id)
        );
        
        setRecommendedArtworks(uniqueRecommendations);
      } catch (error) {
        setError('Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [searchParams]);

  const handleStartOver = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Perfect Artworks</h2>
          <p className="text-gray-600">Analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! {error}</h2>
          <button onClick={handleStartOver} className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600">
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-8">
      {/* Social Links Code remains the same... */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">some other artworks you might like</h1>
          <button onClick={handleStartOver} className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600">
            Start Over
          </button>
        </div>

        {recommendedArtworks.length > 0 ? (
          <ArtworkGallery artworks={recommendedArtworks} onArtworkClick={setSelectedArtwork} />
        ) : (
          <div className="text-center text-gray-600 p-8 bg-white rounded-2xl">
            <p className="text-lg">No recommendations available.</p>
          </div>
        )}
      </div>

      <ArtworkDetailModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </div>
  );
}

// 2. The main exported component now just wraps everything in Suspense
export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-xl font-medium text-purple-600">Loading Page...</p>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}