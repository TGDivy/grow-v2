import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodObject } from "zod";

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        if (e instanceof Error) {
            res.status(400).send(e.message);
            return;
        }
        res.status(400).send(e);
    }
};

export { validate };
