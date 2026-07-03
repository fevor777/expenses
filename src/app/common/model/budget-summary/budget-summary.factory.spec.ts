import { computeFrameStats } from './budget-summary.factory';

describe('computeFrameStats', () => {
  it('counts an inclusive 34-day frame and includes today in days passed', () => {
    const frameStart = new Date(2026, 5, 5, 12, 0, 0, 0).getTime();
    const frameFinish = new Date(2026, 6, 8, 12, 0, 0, 0).getTime();
    const now = new Date(2026, 6, 3, 12, 0, 0, 0);

    const frame = computeFrameStats(frameStart, frameFinish, now);

    expect(frame.daysInFrame).toBe(34);
    expect(frame.daysPassed).toBe(29);
    expect(frame.daysLeft).toBe(5);
    expect(frame.finish).toBe(frameFinish);
  });
});
