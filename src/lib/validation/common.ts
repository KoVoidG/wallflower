import { z } from 'zod';

export const idSchema = z.string().uuid('Invalid identifier format');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateSchema = z.coerce.date();

export const monetaryAmountSchema = z.coerce.string().refine((val) => {
  try {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  } catch {
    return false;
  }
}, 'Monetary values must be non-negative numbers');
