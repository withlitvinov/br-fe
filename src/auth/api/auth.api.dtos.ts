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

export type { RegisterRequestDto, LoginRequestDto };
