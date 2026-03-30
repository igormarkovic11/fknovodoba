import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "./firebase/config.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // cache kept for 10 minutes
      retry: 1, // only retry once on failure
      refetchOnWindowFocus: false, // don't refetch when tab is focused
    },
  },
});

// Prefetch critical data before app renders
const prefetchData = async () => {
  // Next match
  await queryClient.prefetchQuery({
    queryKey: ["nextMatch"],
    queryFn: async () => {
      const q = query(
        collection(db, "matches"),
        where("status", "==", "upcoming"),
        orderBy("date", "asc"),
        limit(1),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    },
  });

  // Last result
  await queryClient.prefetchQuery({
    queryKey: ["lastResult"],
    queryFn: async () => {
      const q = query(
        collection(db, "matches"),
        where("status", "==", "played"),
        orderBy("date", "desc"),
        limit(1),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    },
  });

  // Latest news
  await queryClient.prefetchQuery({
    queryKey: ["news", 4],
    queryFn: async () => {
      const q = query(
        collection(db, "news"),
        orderBy("date", "desc"),
        limit(4),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });
};

// Prefetch then render
prefetchData().finally(() => {
  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
