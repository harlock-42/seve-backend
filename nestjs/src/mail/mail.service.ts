import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailDto } from "./sendMail.dto";
import * as nodemailer from 'nodemailer'
import { CompanyService } from "src/companies/companies.service";
import { TokenService } from "src/token/token.service";


@Injectable()
export default class MailService {

	constructor(
		private configService: ConfigService,
        private tokenService: TokenService,
        private companyservice: CompanyService
	) {}

	async sendMail(sendMailDto: SendMailDto): Promise<void> {
		const transporter = nodemailer.createTransport({
			host: this.configService.get<string>('SMTP_HOST'),
			port: this.configService.get<number>('SMTP_PORT'),
			secure: this.configService.get<boolean>('SMTP_SECURE'),
			auth: {
				user: this.configService.get<string>('SMTP_USER'),
				pass: this.configService.get<string>('SMTP_PASSWORD'),
			},
		})

		const mailOptions = {
			from: sendMailDto.from,
			to: sendMailDto.to,
			subject: sendMailDto.subject,
			text: sendMailDto.text,
		}

		await transporter.sendMail(mailOptions)
	}

    async sendWithToken(sendMailDto: SendMailDto): Promise<void> {
        const transporter = nodemailer.createTransport({
			host: this.configService.get<string>('SMTP_HOST'),
			port: this.configService.get<number>('SMTP_PORT'),
			secure: this.configService.get<boolean>('SMTP_SECURE'),
			auth: {
				user: this.configService.get<string>('SMTP_USER'),
				pass: this.configService.get<string>('SMTP_PASSWORD'),
			},
		})
        try {
            const {id} = await this.companyservice.findByEmail(sendMailDto.to)
            const token: string = await this.companyservice.addToken(id)
            const mailOptions = {
                from: sendMailDto.from,
                to: sendMailDto.to,
                subject: "Modification de votre mot de passe Seve",
                text: "Bonjour,\n\nMerci de cliquer sur le lien suivant pour modifier votre mot de passe:\n" +
                'http://' + this.configService.get<string>('FRONTEND_DOMAIN_AND_PORT') + '/resetPassword?token=' + token + '\n\n' +
                'Cordialement,\n\n Seve'
            }
            await transporter.sendMail(mailOptions)
        } catch (error) {

        }
    }

}