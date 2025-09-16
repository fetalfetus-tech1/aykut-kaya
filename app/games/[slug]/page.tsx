import { notFound } from 'next/navigation';
import { Game } from '@/types/game';
import gamesData from '@/data/games.json';

interface GamePageProps {
  params: {
    slug: string;
  };
}

const StarRating = ({ rating }: { rating: number }) => {
  // Normalize rating to 0-5 scale (assuming input is 0-10)
  const normalizedRating = Math.max(0, Math.min(5, rating / 2));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 !== 0;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={i} className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="ml-3 text-lg text-gray-600 dark:text-gray-400 font-semibold">
        {rating.toFixed(1)}/10
      </span>
    </div>
  );
};

export default function GamePage({ params }: GamePageProps) {
  const game = gamesData.find((g: Game) => g.slug === params.slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Oyunlara Geri Dön
          </a>
        </div>

        {/* Game Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Game Image */}
          <div className="aspect-video relative">
            <img 
              src={game.thumbnail} 
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Game Info */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {game.title}
                </h1>
                <StarRating rating={game.rating} />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Kategoriler
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.categories.map((category) => (
                  <span 
                    key={category}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Bu oyun hakkında
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {game.fullDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}