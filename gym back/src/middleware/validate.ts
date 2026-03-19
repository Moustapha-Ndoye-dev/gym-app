import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodObject<any, any> | ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = (await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })) as any;
    
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) Object.assign(req.query, parsed.query);
    if (parsed.params) Object.assign(req.params, parsed.params);
    next();
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      console.log('[AUTH-DEV] Validation Failed:', JSON.stringify(err.issues, null, 2));
      return res.status(400).json({
        message: 'Validation échouée',
        errors: err.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
      });
    }
    console.error('Validation middleware error:', err);
    return res.status(500).json({ message: 'Erreur interne de validation', error: err instanceof Error ? err.message : err });
  }
};
