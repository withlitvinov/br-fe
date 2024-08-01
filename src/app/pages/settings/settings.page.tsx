import { MoveLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { usePageTitle } from '@/common/contexts';

import { TimeZoneSetting } from './TimeZoneSetting';

const TITLE = 'Settings';

const SettingsPage = () => {
  usePageTitle(TITLE);

  return (
    <div className="flex flex-col gap-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-x-2 w-fit hover:text-blue-400"
      >
        <MoveLeftIcon /> Back to home page
      </Link>
      <div>
        <TimeZoneSetting />
      </div>
    </div>
  );
};

export { SettingsPage };
