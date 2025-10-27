import { useMemo } from 'react';

type RoleData = {
  role: string;
  value: number;
};

export function useRoleStats(data: RoleData[]) {
  const total = useMemo(() => data.reduce((sum, r) => sum + r.value, 0), [data]);

  const getPercentage = (roleValue: number) => (total > 0 ? (roleValue / total) * 100 : 0);

  return { total, getPercentage };
}
