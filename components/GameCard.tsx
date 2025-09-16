import Link from 'next/link';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
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
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        <div className="aspect-video relative">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {game.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          <div className="flex justify-between items-center">
            <StarRating rating={game.rating} />
            <div className="flex flex-wrap gap-1">
              <span
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              >
                {game.genre}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}