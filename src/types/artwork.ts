export interface Artwork {
  description: string;
  artist: string;
  image_url: string;
  genre: string;
  vector_index: number;
  id: string;
}

export interface RecommendationResponse {
  recommendations: Artwork[];
}
