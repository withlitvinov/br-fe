type CreatedProfileDto = {
  id: string;
  name: string;
  birthday: string;
};

type ProfileDto = {
  id: string;
  name: string;
  birthday: string;
  is_full: boolean;
};

type DetailedProfileDto = {
  id: string;
  name: string;
  birthday: string;
  is_full: boolean;
};

export type { CreatedProfileDto, ProfileDto, DetailedProfileDto };
