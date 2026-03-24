export interface Player {
  id: string;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  number: number;
  goals: number;
  assists: number;
  age?: number;
  bio?: string;
  photoUrl?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface Match {
  id: string;
  opponent: string;
  opponentLogo?: string;
  date: string;
  homeAway: "home" | "away";
  score?: string;
  goalsFor?: number;
  goalsAgainst?: number;
  status: "upcoming" | "played";
  competition: string;
  venue: string;
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  excerpt?: string;
  date: string;
  tag: string;
  coverImage?: string;
}

export interface Standing {
  id: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  logoUrl?: string;
}
