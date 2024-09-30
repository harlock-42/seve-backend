import { Injectable, NestMiddleware } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly reflector: Reflector) {}

	use(req: Request, res: Response, next: NextFunction) {
		const apiSecret = process.env.API_SECRET
		const requestSecret = req.headers['x-api-secret']
		// if (requestSecret !== apiSecret) {
		// 	return res.status(403).json({ message: 'Forbidden'})
		// }
		next();
	}
}