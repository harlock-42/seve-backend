import { ApiProperty } from "@nestjs/swagger"
import { CreateAddressDto } from "src/address/dtos/createAddress.dto"

export class SignUpDto {
    @ApiProperty({
		description: 'The name of the company',
		example: "Haigo"
	})
	companyName: string

    @ApiProperty({
		description: 'First name of the company\'s worker',
		example: "Haigo"
	})
    firstName: string

    @ApiProperty({
		description: 'Last name of the company\'s worker',
		example: "Dupont"
	})
    lastName: string

    @ApiProperty({
		description: 'The VAT number of the company',
		example: "FR 32 123456789"
	})
    vatNumber: string

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

    @ApiProperty({
        description: 'Address of the company',
        type: CreateAddressDto,
    })
    address: CreateAddressDto
}