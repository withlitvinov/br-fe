export type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
  birthday: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  access_token: string;
  expires_in: number;
};

export type RefreshResponseDto = {
  access_token: string;
  expires_in: number;
};
