export function isTrialActive(createdAt) {
  const now = Date.now();
  const created = createdAt.toDate().getTime();
  return now - created < 3 * 24 * 60 * 60 * 1000;
}
