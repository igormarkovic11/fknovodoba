import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { CommentaryEvent, Lineup, Match } from "../types";

export const useLiveMatch = (matchId: string) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    const unsub = onSnapshot(doc(db, "matches", matchId), (snap) => {
      if (snap.exists()) {
        setMatch({ id: snap.id, ...snap.data() } as Match);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [matchId]);

  return { match, loading };
};

export const useCommentary = (matchId: string) => {
  const [events, setEvents] = useState<CommentaryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    const q = query(
      collection(db, "matches", matchId, "commentary"),
      orderBy("minute", "desc"),
      limit(50),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CommentaryEvent[];
      setEvents(data);
      setLoading(false);
    });
    return () => unsub();
  }, [matchId]);

  return { events, loading };
};

export const useLineup = (matchId: string) => {
  const [lineup, setLineup] = useState<Lineup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    const unsub = onSnapshot(
      doc(db, "matches", matchId, "lineup", "data"),
      (snap) => {
        if (snap.exists()) {
          setLineup(snap.data() as Lineup);
        }
        setLoading(false);
      },
    );
    return () => unsub();
  }, [matchId]);

  return { lineup, loading };
};

export const useLiveMatches = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  useEffect(() => {
    const q = query(collection(db, "matches"));
    const unsub = onSnapshot(q, (snapshot) => {
      const live = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Match)
        .filter((m) => m.status === "live");
      setLiveMatches(live);
    });
    return () => unsub();
  }, []);

  return liveMatches;
};
