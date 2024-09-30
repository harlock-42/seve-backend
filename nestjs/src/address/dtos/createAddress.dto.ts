import { ApiProperty } from "@nestjs/swagger"

export class CreateAddressDto {
    @ApiProperty({ 
        description: 'The street number of the address',
        example: 123
    })
    streetNumber: string
    
    @ApiProperty({
        description: 'The street name of the address',
        example: 'Baker Street'
    })
    streetName: string
    
    @ApiProperty({
        description: 'The zip code of the address',
        example: 90210
    })
    zipCode: string
    
    @ApiProperty({
        description: 'The city of the address',
        example: 'Los Angeles'
    })
    city: string
}