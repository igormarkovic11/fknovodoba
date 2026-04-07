import type { LineupPlayer } from "../types";

const positionOrder: Record<string, number> = {
  Goalkeeper: 1,
  Defender: 2,
  Midfielder: 3,
  Forward: 4,
};

export const sortByPosition = (players: LineupPlayer[]): LineupPlayer[] => {
  return [...players].sort((a, b) => {
    const orderA = positionOrder[a.position] ?? 5;
    const orderB = positionOrder[b.position] ?? 5;
    return orderA - orderB;
  });
};
