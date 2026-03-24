import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { NewsPost } from "../types";

export const useNews = (count: number = 4) => {
  return useQuery({
    queryKey: ["news", count],
    queryFn: async (): Promise<NewsPost[]> => {
      const q = query(
        collection(db, "news"),
        orderBy("date", "desc"),
        limit(count),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as NewsPost,
      );
    },
  });
};

export const useNewsPost = (id: string) => {
  return useQuery({
    queryKey: ["newsPost", id],
    queryFn: async (): Promise<NewsPost | null> => {
      const ref = doc(db, "news", id);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as NewsPost;
    },
    enabled: !!id,
  });
};
