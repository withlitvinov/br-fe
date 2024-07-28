import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
});

const validate = (data: Record<string, unknown>) => {
  const parsed = schema.safeParse(data);

  if (parsed.error) {
    throw new Error('Invalid config');
  }

  return parsed.data;
};

export default validate(import.meta.env)!;
