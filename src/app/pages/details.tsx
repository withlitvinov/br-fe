import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { useDiContainer } from '@/common/contexts';
import { ProfilesApi } from '@/profiles';

import { BIRTHDAY_PROFILE_BY_ID_KEY } from '../constants';

function DetailsContent() {
  const { id } = useParams();
  const container = useDiContainer();

  const isId = !!id;

  const { data } = useQuery({
    queryKey: [BIRTHDAY_PROFILE_BY_ID_KEY, id],
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

export function DetailsPage() {
  return (
    <>
      <Link to="/">Back to home</Link>
      <DetailsContent />
    </>
  );
}
