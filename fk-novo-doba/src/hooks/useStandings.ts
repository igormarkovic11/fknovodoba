import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Standing } from "../types";

export const useStandings = (season: string) => {
  return useQuery({
    queryKey: ["standings", season],
    queryFn: async (): Promise<Standing[]> => {
      const q = query(
        collection(db, "standings", season, "teams"),
        orderBy("points", "desc"),
      );
      const snapshot = await getDocs(q);
      const teams = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Standing,
      );

      // Sort by points desc, then goal difference desc
      return teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        return gdB - gdA;
      });
    },
    enabled: !!season,
  });
};

export const useSeasons = () => {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: async (): Promise<string[]> => {
      const snapshot = await getDocs(collection(db, "standings"));
      return snapshot.docs
        .map((doc) => doc.id)
        .filter((id) => id !== "placeholder")
        .sort()
        .reverse();
    },
  });
};
