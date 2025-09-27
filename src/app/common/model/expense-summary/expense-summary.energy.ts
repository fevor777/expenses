export function computeEnergyScore(
  extraPct: number | undefined,
  velocityState: number | undefined,
  spikeFlags: number,
  weights: { extraPct: number; velocityState: number; spike: number }
): number {
  const extra = ((extraPct || 0) / 100) * weights.extraPct;
  const velocity = (velocityState || 0) * weights.velocityState;
  const spikes = spikeFlags * weights.spike;
  return Math.round((extra + velocity + spikes) * 10) / 10;
}
