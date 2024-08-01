type MyResponseDto = {
  id: string;
  name: string;
  email: string;
  birthday: string;
  config: {
    time_zone: string;
  };
};

export type { MyResponseDto };
