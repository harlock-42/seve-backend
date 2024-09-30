import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import MailService from "./mail.service";
import MailController from "./mail.controller";
import { CompanyModule } from "src/companies/companies.module";
import { TokenModule } from "src/token/token.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
        TokenModule,
        CompanyModule
	],
	providers: [
		MailService,
	],
	controllers: [
		MailController,
	],
	exports: []
})

export default class MailModule {}