import { ApiProperty } from "@nestjs/swagger";

export class UploadImageDto {
	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'The image to upload'
	})
	image: any
}