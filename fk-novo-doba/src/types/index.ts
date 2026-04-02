export interface Player {
  id: string;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  number: number;
  goals: number;
  assists: number;
  appearances: number;
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
  status: "upcoming" | "played" | "live";
  competition: string;
  venue: string;
  scoreHome?: number;
  scoreAway?: number;
}

export interface LineupPlayer {
  playerId: string;
  name: string;
  number: number;
  position: string;
}

export interface Lineup {
  starting: LineupPlayer[];
  reserves: LineupPlayer[];
}

export interface CommentaryEvent {
  id: string;
  minute: number;
  type:
    | "goal"
    | "yellow_card"
    | "red_card"
    | "substitution"
    | "comment"
    | "halftime"
    | "fulltime";
  text: string;
  createdAt: number;
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
}
