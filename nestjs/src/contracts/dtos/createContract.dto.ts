import { ApiProperty } from "@nestjs/swagger";

export class CreateContractDto {
    @ApiProperty({
		description: 'Amount af money given by the company to the project',
		example: 5000
	})
    amount: number

    @ApiProperty({
        description: "Company's id",
    })
    companyId: string

    @ApiProperty({
        description: "Project's id",
    })
    projectId: string
}