import { Body, Controller, Post, Req } from "@nestjs/common";
import MailService from "./mail.service";
import { SendMailDto } from "./sendMail.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";
import { Request } from "express";

@ApiTags('mail')
@Controller('mail')
export default class MailController {
	constructor(private readonly mailService: MailService) {}

    @Public()
	@ApiOperation({ summary: "Send a mail"})
	@ApiBody({ type: SendMailDto, description: "Informations needed to send the mail"})
	@ApiResponse({ status: 201, description: "The message is sent"})
	@Post('send')
	@ApiSecurity('x-api-secret')
	async send(
		@Body() sendMailDto: SendMailDto
	) {
		return this.mailService.sendMail(sendMailDto)
	}

    @Public()
	@ApiOperation({ summary: "Send a mail with a link"})
	@ApiBody({ type: SendMailDto, description: "Informations needed to send the mail"})
	@ApiResponse({ status: 201, description: "The message is sent"})
	@Post('sendWithToken')
	@ApiSecurity('x-api-secret')
	async sendWithToken(
		@Body() sendMailDto: SendMailDto,
	) {
		return this.mailService.sendWithToken(sendMailDto)
	}
}