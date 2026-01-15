export const genreColors: Record<string, string> = {
  'Baroque': 'bg-purple-100 text-purple-800 border-purple-300',
  'Art Nouveau Modern': 'bg-pink-100 text-pink-800 border-pink-300',
  'Cubism': 'bg-blue-100 text-blue-800 border-blue-300',
  'Contemporary Realism': 'bg-green-100 text-green-800 border-green-300',
  'Color Field Painting': 'bg-orange-100 text-orange-800 border-orange-300',
  'Early Renaissance': 'bg-amber-100 text-amber-800 border-amber-300',
  'Impressionism': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'Abstract Expressionism': 'bg-red-100 text-red-800 border-red-300',
  'Surrealism': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Pop Art': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
  'Minimalism': 'bg-slate-100 text-slate-800 border-slate-300',
};

export function getGenreColor(genre: string): string {
  return genreColors[genre] || 'bg-gray-100 text-gray-800 border-gray-300';
}

export function parseGenres(genreString: string): string[] {
  try {
    // Remove outer quotes and parse as JSON array
    const cleaned = genreString.replace(/^['"]|['"]$/g, '');
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [genreString];
  } catch {
    // If parsing fails, try to extract genres manually
    const match = genreString.match(/\[(.*?)\]/);
    if (match) {
      return match[1].split(',').map(g => g.trim().replace(/['"]/g, ''));
    }
    return [genreString];
  }
}
