import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import ImagesService from "./images.service";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadImageDto } from "./dtos/uploadImage.dto";
import { Response } from "express";
import { Public } from "src/auth/decorators/public.decorator";


@ApiTags('Images')
@Controller('images')
export default class ImagesController {
	constructor(
		private imageService: ImagesService
	) {}

    @Public()
	@Get(':filename')
	@ApiOperation({ summary: 'Download on image by his keyFile'})
	@ApiParam({ name: 'filename', description: 'The key associate to the file looking for'})
	@ApiOkResponse({ description: 'Image downloaded successfully'})
	@ApiBadRequestResponse({ description: 'Bad request'})
	@ApiSecurity('x-api-secret')
	async download(@Param('filename') keyfile: string, @Res() res: Response) {
		const image = await this.imageService.downloadOne(keyfile)
		if (image) {
			res.setHeader('Content-Type', 'image/jpeg')
			res.send(image)
		} else {
			res.status(404).send('Image not found')
		}
	}

    @Public()
	@Post('upload')
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: "Upload an image, convert it to jpeg format and save it in volume"})
	@ApiOkResponse({ description: "File uploaded and converted successfully"})
	@ApiBadRequestResponse({ description: "Bad request"})
	@ApiBody({ type: UploadImageDto})
	@UseInterceptors(FileInterceptor('image'))
	@ApiSecurity('x-api-secret')
	async uploadImage(@UploadedFile() file: Express.Multer.File) {
		return this.imageService.uploadOne(file)
	}
}