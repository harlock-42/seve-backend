import { Body, Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import PdfFileService from "../services/pdfFiles.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/decorators/CurrentUser.decorator";
import { UploadPdfDto } from "../dtos/uploadPdf.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { PdfType } from "../dtos/uploadPdf.dto";
import * as fs from 'fs';

@ApiTags('contracts/pdfFiles')
@Controller('contracts/pdfFiles')
export class PdfFileController {
    constructor(
        private readonly pdfFileService: PdfFileService,
		private configService: ConfigService

    ) {}

    @Post('sponsorshipAgreement')
    @Public()
    @UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
        description: 'Le fichier PDF à télécharger',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                'file': {
                    type: 'string',
                    format: 'binary',
                },
                'projectId': {
                    type: 'string'
                },
                'companyId': {
                    type: 'string'
                },
                'pdfType': {
                    type: 'string',
                    enum: Object.values(PdfType)
                }
            },
        },
	})
	@ApiOperation({ summary: 'Upload the sponsorship agreement pdf' })
	@ApiResponse({ status: 200, description: 'pdf file uploaded' })
	uploadPdf(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadPdfDto: UploadPdfDto
    ) {
        return this.pdfFileService.uploadPdf(file, uploadPdfDto.companyId, uploadPdfDto.projectId, uploadPdfDto.pdfType)
    }

    @Public()
    @Get(':filename')
    @ApiOperation({ summary: 'Download a pdf file by his keyFile'})
    @ApiParam({ name: 'filename', description: 'The key associate to the file looking for'})
    @ApiOkResponse({ description: 'Pdf file downloaded successfully'})
    @ApiBadRequestResponse({ description: 'Bad request'})
    @ApiSecurity('x-api-secret')
    async download(
        @Param('filename') keyfile: string,
        @Res() res: Response
    ) {
        try {
            const fileStream = await this.pdfFileService.getFileStream(keyfile)
            const path: string = this.configService.get<string>('UPLOAD_PDF_PATH')
            const filePath: string = `${path}/${keyfile}`
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/pdf');
                fileStream.pipe(res)            
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            res.status(500).send('An error occurred while fetching the file');
        }
    }
}

