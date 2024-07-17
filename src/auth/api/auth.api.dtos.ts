type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
  birthday: string;
};

type LoginRequestDto = {
  email: string;
  password: string;
};

type LoginResponseDto = {
  access_token: string;
  expires_in: number;
};

type RefreshResponseDto = {
  access_token: string;
  expires_in: number;
};

export type {
  RegisterRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshResponseDto,
};
