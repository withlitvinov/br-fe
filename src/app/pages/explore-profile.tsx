import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useDiContainer } from '@/common/contexts';
import { ProfilesApi } from '@/profiles';

import { PROFILE_BY_ID } from '../constants';

function ExploreProfileContent() {
  const { id } = useParams();
  const container = useDiContainer();

  const isId = !!id;

  const { data } = useQuery({
    queryKey: [PROFILE_BY_ID, id],
    queryFn: () => container.get(ProfilesApi).getById(id!),
    enabled: isId,
  });

  if (!isId) {
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

export function ExploreProfilePage() {
  return (
    <>
      <Link to="/">Back to home</Link>
      <ExploreProfileContent />
    </>
  );
}
