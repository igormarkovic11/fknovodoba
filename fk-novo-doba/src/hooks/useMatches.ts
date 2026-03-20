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

const fetchMatches = async (): Promise<Match[]> => {
  const q = query(collection(db, "matches"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Match);
};

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
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
