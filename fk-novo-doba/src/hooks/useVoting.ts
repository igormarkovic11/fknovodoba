import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Vote, VoteResult } from "../types";

const VOTE_KEY = (matchId: string) => `voted_match_${matchId}`;

export const useVoting = (matchId: string) => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    // Check if user already voted
    const voted = localStorage.getItem(VOTE_KEY(matchId));
    if (voted) setHasVoted(true);
    fetchResults();
  }, [matchId]);

  const fetchResults = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "matches", matchId, "votes")),
      );
      const votes = snapshot.docs.map((d) => d.data() as Vote);
      const total = votes.length;

      // Count votes per player
      const counts: Record<string, { name: string; count: number }> = {};
      votes.forEach((vote) => {
        if (!counts[vote.playerId]) {
          counts[vote.playerId] = { name: vote.playerName, count: 0 };
        }
        counts[vote.playerId].count++;
      });

      // Convert to results array sorted by votes
      const results: VoteResult[] = Object.entries(counts)
        .map(([playerId, data]) => ({
          playerId,
          playerName: data.name,
          count: data.count,
          percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      setResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (playerId: string, playerName: string) => {
    if (hasVoted || saving) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "matches", matchId, "votes"), {
        playerId,
        playerName,
        createdAt: Date.now(),
      });
      localStorage.setItem(VOTE_KEY(matchId), playerId);
      setHasVoted(true);
      await fetchResults();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return { results, hasVoted, loading, saving, vote };
};
