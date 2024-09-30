import { ApiProperty } from "@nestjs/swagger"

export class SignInDto {
    @ApiProperty({
        description: 'The email of the company',
        example: "contact@haigo.fr"
    })
    email: string

    @ApiProperty({
        description: 'Pasword of the company\'s account',
        example: 'UUXYdZzNXidOZlwVjPtKAg'
    })
	password: string
}