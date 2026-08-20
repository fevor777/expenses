export type BalanceFilter = 'all' | 'budget' | 'nonBudget';

export const DEFAULT_BALANCE_FILTER: BalanceFilter = 'all';

export function matchesBalanceFilter(
  includeInBalance: boolean | undefined,
  balanceFilter: BalanceFilter = DEFAULT_BALANCE_FILTER
): boolean {
  if (balanceFilter === 'budget') {
    return includeInBalance === true;
  }

  if (balanceFilter === 'nonBudget') {
    return includeInBalance === false;
  }

  return true;
}
