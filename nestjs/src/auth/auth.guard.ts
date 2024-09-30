import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as cookie from 'cookie'


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private configService: ConfigService
        ) {}
        
        async canActivate(context: ExecutionContext): Promise<boolean> {
            
            // Check if the route has @Public() decorator.
            // And by pass authentification checking if it s true.
            const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
                context.getHandler(),
                context.getClass
            ])
            if (isPublic) {
                return true
            }
            
            
            const request = context.switchToHttp().getRequest()
            const token = this.extractTokenFromCookie(request)
            if (!token) {
                throw new UnauthorizedException()
            }
            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.configService.get<string>('JWT_SECRET')
                    }
                )
                request["user"] = payload
            } catch {
                throw new UnauthorizedException()
            }
            return true
        }
        
        private extractTokenFromHeader(request: Request): string | undefined {
            const [type, token] = request.headers.authorization?.split(' ') ?? []
            return type === 'Bearer' ? token : undefined
        }
        
        private extractTokenFromCookie(request: Request): string | undefined {
            const cookies = cookie.parse(request.headers.cookie || '')
            return cookies.accessToken
        }
    }
    
    export class GqlAuthGuard extends AuthGuard {
        getRequest (context: ExecutionContext)
        {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req;
        }
    }