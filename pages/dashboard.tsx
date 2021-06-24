import { useQuery } from 'react-query';

import { useAuth } from 'lib/auth';
import { fetcher } from 'utils/fetcher';
import { Site } from 'interfaces/Site';

import { EmptyState } from 'components/EmptyState';
import SiteTableSkeleton from 'components/SiteSkeletonTable';
import DashboardShell from 'components/DashboardShell';
import SiteTable from 'components/SiteTable';

export const getSites = async (token: string): Promise<Site[]> => {
  return await fetcher('/api/sites', token);
};

export default function Dashboard(): React.ReactElement {
  const { user } = useAuth();
  const token = user ? user.token : null;
  const isUserLoad = user ? true : false;

  const { data, isLoading } = useQuery(
    ['sites', token],
    () => getSites(token),
    { enabled: isUserLoad }
  );

  if (isLoading || !isUserLoad) {
    return (
      <DashboardShell>
        <SiteTableSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {data ? <SiteTable sites={data} /> : <EmptyState />}
    </DashboardShell>
  );
}
