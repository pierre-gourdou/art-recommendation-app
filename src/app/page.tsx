'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SwipeCard from '@/components/SwipeCard';
import { Artwork } from '@/types/artwork';
export default function Home() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedArtworks, setLikedArtworks] = useState<Artwork[]>([]);
  const [dislikedArtworks, setDislikedArtworks] = useState<string[]>([]);

  useEffect(() => {
    const fetchRandomArtworks = async () => {
      try {
        const response = await fetch('/api/random-art');
        if (response.ok) {
          const data = await response.json();
          console.log('Random artworks fetched:', data);
          const artworkList = Array.isArray(data) ? data : data.artworks || [];
          setArtworks(artworkList);
        } else {
          console.error('Failed to fetch random artworks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching random artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomArtworks();
  }, []);

  const handleLike = () => {
    const currentArtwork = artworks[currentIndex];
    const updatedLikedArtworks = [...likedArtworks, currentArtwork];
    setLikedArtworks(updatedLikedArtworks);
    console.log('Liked:', currentArtwork.artist, '-', currentArtwork.description);
    
    if (currentIndex < artworks.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      // Last artwork, redirect to gallery with liked IDs
      const likedIds = updatedLikedArtworks.map(a => a.id).join(',');
      setTimeout(() => {
        router.push(`/gallery?liked=${likedIds}`);
      }, 300);
    }
  };

  const handleDislike = () => {
    const currentArtwork = artworks[currentIndex];
    setDislikedArtworks([...dislikedArtworks, currentArtwork.id]);
    console.log('Disliked:', currentArtwork.artist, '-', currentArtwork.description);
    
    if (currentIndex < artworks.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      // Last artwork, redirect to gallery with liked IDs
      const likedIds = likedArtworks.map(a => a.id).join(',');
      setTimeout(() => {
        router.push(`/gallery?liked=${likedIds}`);
      }, 300);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Artworks
          </h2>
          <p className="text-gray-600">
            Preparing your art collection...
          </p>
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Artworks Available
          </h2>
          <p className="text-gray-600">
            Failed to load artworks. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const currentArtwork = artworks[currentIndex];
  const imageUrl = currentArtwork 
    ? `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${currentArtwork.id}.jpg`
    : '';


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
      {/* Social Links */}
      <div className="fixed top-4 right-4 flex gap-3 z-50">
        <a
          href="https://github.com/pierre-gourdou"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="GitHub"
        >
          <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/pierre-gourdou/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
      <main className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              let me know your taste in art
            </h1>
            <p className="text-gray-600">
              {currentIndex + 1} / {artworks.length}
            </p>
          </div>

          <SwipeCard
            key={currentArtwork.id}
            imageUrl={imageUrl}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>
      </main>
    </div>
  );
}
