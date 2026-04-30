import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Match } from "../types";

export const useMatches = (season?: string) => {
  return useQuery({
    queryKey: ["matches", season],
    queryFn: async (): Promise<Match[]> => {
      const q = season
        ? query(
            collection(db, "matches"),
            where("season", "==", season),
            orderBy("date", "desc"),
            limit(100),
          )
        : query(collection(db, "matches"), orderBy("date", "desc"), limit(100));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Match,
      );
    },
  });
};

export const useSeasonsList = () => {
  return useQuery({
    queryKey: ["seasonsList"],
    queryFn: async (): Promise<string[]> => {
      const snapshot = await getDocs(collection(db, "matches"));
      const seasons = new Set<string>();
      snapshot.docs.forEach((doc) => {
        const season = doc.data().season;
        if (season) seasons.add(season);
      });
      const list = Array.from(seasons).sort().reverse();
      // If no seasons found return current season as default
      return list.length > 0 ? list : ["2025-26"];
    },
  });
};

export const useLastResult = () => {
  return useQuery({
    queryKey: ["lastResult"],
    queryFn: async (): Promise<Match | null> => {
      const q = query(
        collection(db, "matches"),
        where("status", "==", "played"),
        orderBy("date", "desc"),
        limit(1),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Match;
    },
  });
};

export const useNextMatch = () => {
  return useQuery({
    queryKey: ["nextMatch"],
    queryFn: async (): Promise<Match | null> => {
      const q = query(
        collection(db, "matches"),
        where("status", "==", "upcoming"),
        orderBy("date", "asc"),
        limit(1),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Match;
    },
  });
};
