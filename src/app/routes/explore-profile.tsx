import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { DiSymbols } from '@/core/di';
import { IPersonProfilesApi } from '@/api';
import { useDi } from '@/global-contexts';

type PageParams = {
  id: string;
};

function ExploreProfile() {
  const { id } = useParams<PageParams>();
  const container = useDi();

  const { data } = useQuery({
    queryKey: ['personProfile', id],
    queryFn: () => {
      return container
        .get<IPersonProfilesApi>(DiSymbols.PersonProfilesApi)
        .getById(id!);
    },
    enabled: !!id,
  });

  if (!id) {
    return <>Missing id</>;
  }

  return (
    <>
      <h1>Person profile</h1>
      {data && (
        <div>
          <p>
            <b>Name:</b> {data.name}
          </p>
          <p>
            <b>Birthday date:</b> {data.birthday}
          </p>
        </div>
      )}
    </>
  );
}

function ExploreProfileWithNavigation() {
  return (
    <>
      <Link to="/">Back to home</Link>
      <ExploreProfile />
    </>
  );
}

export default ExploreProfileWithNavigation;
