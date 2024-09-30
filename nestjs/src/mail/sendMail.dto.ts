import { ApiProperty } from "@nestjs/swagger"

export class SendMailDto {
	@ApiProperty({ example: 'jeanne-darc@gmail.com', description: "User's email address"})
	from: string
	@ApiProperty({ example: 'Jeanne d\'Arc', description: "User's name"})
	to: string
	@ApiProperty({ example: 'vatican', description: "User's company name"})
	subject: string
	@ApiProperty({ example: 'Hi, Can i have more informations please', description: "The content of the mail to send"})
	text: string
}