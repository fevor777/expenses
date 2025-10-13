import { Injectable } from '@angular/core';
import { GLOBAL_SWIPE_LENGTH } from '../../constants';

@Injectable({ providedIn: 'root' })
export class GlobalSwipeLengthStoreService {
  /** Get current swipe length directly from localStorage (fallback to constant). */
  getSwipeLength(): number {
    const raw = localStorage.getItem('globalSwipeLength');
    const num = raw !== null ? Number(raw) : GLOBAL_SWIPE_LENGTH;
    return Number.isFinite(num) && num > 0 ? Math.round(num) : GLOBAL_SWIPE_LENGTH;
  }

  /** Persist new positive threshold; returns resolved current value. */
  saveSwipeLength(length: number): number {
    if (Number.isFinite(length) && length > 0) {
      localStorage.setItem('globalSwipeLength', String(Math.round(length)));
    }
    return this.getSwipeLength();
  }
}
