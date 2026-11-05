import { z } from 'zod';

// Flat JSON fields shared by this example's create and patch inputs.
export const Fields = z.object({
  theme: z.string(),
  fontSize: z.number(),
});

export const Create = Fields.extend({
  theme: Fields.shape.theme.default('light'),
  fontSize: Fields.shape.fontSize.default(14),
});

export const Patch = Fields.partial();
