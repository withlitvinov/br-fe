export type CreateOneProfileDto = {
  name: string;
  birthday: {
    year: number | null;
    month: number;
    day: number;
  };
};
