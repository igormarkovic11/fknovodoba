import type { CommentaryEvent } from "../types";

const emojis: Record<CommentaryEvent["type"], string> = {
  goal: "⚽",
  yellow_card: "🟨",
  red_card: "🟥",
  substitution: "🔄",
  comment: "💬",
  halftime: "🔔",
  fulltime: "🏁",
};

const templates: Record<
  CommentaryEvent["type"],
  (minute: number, text: string) => string
> = {
  goal: (minute, text) => `${minute}' — ${text}`,
  yellow_card: (minute, text) => `${minute}' — ${text}`,
  red_card: (minute, text) => `${minute}' — ${text}`,
  substitution: (minute, text) => `${minute}' — ${text}`,
  comment: (minute, text) => `${minute}' — ${text}`,
  halftime: (_, text) => `Poluvrijeme — ${text}`,
  fulltime: (_, text) => `Kraj utakmice — ${text}`,
};

export const formatCommentary = (
  type: CommentaryEvent["type"],
  minute: number,
  text: string,
): string => {
  return templates[type](minute, text);
};

export const getEmoji = (type: CommentaryEvent["type"]): string => {
  return emojis[type];
};
