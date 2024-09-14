const AUTHENTICATION_STATUS_STORAGE_KEY = 'auth_status';

export const authStatusStorage = {
  clear: () => {
    localStorage.removeItem(AUTHENTICATION_STATUS_STORAGE_KEY);
  },
  set: (status: boolean) => {
    if (status) {
      localStorage.setItem(AUTHENTICATION_STATUS_STORAGE_KEY, 'true');
    }
  },
  check: () => {
    const _ = localStorage.getItem(AUTHENTICATION_STATUS_STORAGE_KEY);

    if (_) {
      return _ === 'true';
    }

    return false;
  },
};
