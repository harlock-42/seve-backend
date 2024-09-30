import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CompanyModule } from "src/companies/companies.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, GqlAuthGuard } from "./auth.guard";
import { TokenModule } from "src/token/token.module";

@Module({
	imports: [
        CompanyModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                global: true,
                signOptions: { expiresIn: '1d' }
            })
        }),
    ],
	providers: [
		AuthService,
        {
            provide: APP_GUARD,
            useClass: GqlAuthGuard
        }
	],
	controllers: [
		AuthController
	],
	exports: [
        AuthService
    ]
})
export class AuthModule {}