export interface Game {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  shortDesc: string;
  fullDesc: string;
  rating: number;
  categories: string[];
}