import { Request, Response, NextFunction } from 'express';

const stripTags = (value: string): string => {
  return value.replace(/<[^>]*>/g, '');
};

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return stripTags(value).trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) req.body = sanitizeValue(req.body) as typeof req.body;
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key as keyof typeof req.query] === 'string') {
        (req.query as Record<string, string>)[key] = stripTags((req.query as Record<string, string>)[key]);
      }
    }
  }
  if (req.params) {
    for (const key of Object.keys(req.params)) {
      req.params[key] = stripTags(req.params[key]);
    }
  }
  next();
};
