import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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
