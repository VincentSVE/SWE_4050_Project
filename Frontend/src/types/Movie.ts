export interface Movie {
    _id?: string;
    id?: string;
    title: string;
    genre: string[];
    currentlyPlaying: boolean;
    rating: string;
    description: string;
    poster: string;
    trailer: string;
  }