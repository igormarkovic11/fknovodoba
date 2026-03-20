import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Player, Staff } from "../types";

export const usePlayers = () => {
  return useQuery({
    queryKey: ["players"],
    queryFn: async (): Promise<Player[]> => {
      const q = query(collection(db, "players"), orderBy("number", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Player,
      );
    },
  });
};

export const usePlayer = (id: string) => {
  return useQuery({
    queryKey: ["player", id],
    queryFn: async (): Promise<Player | null> => {
      const ref = doc(db, "players", id);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as Player;
    },
    enabled: !!id,
  });
};

export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async (): Promise<Staff[]> => {
      const q = query(collection(db, "staff"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Staff,
      );
    },
  });
};
