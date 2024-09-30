import { Repository } from "typeorm";
import { PdfFile } from "../entities/pdfFiles.entity";
import * as path from 'path'
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from 'uuid'
import { HttpException, HttpStatus } from "@nestjs/common";import * as fs from 'fs'
import { PdfType } from "../dtos/uploadPdf.dto";

export default class PdfFileService {
    constructor(
        @InjectRepository(PdfFile)
        private readonly pdfFileRepository: Repository<PdfFile>,
		private configService: ConfigService
    ) {}

    async createOne(): Promise<PdfFile> {
        const newPdfFiles = this.pdfFileRepository.create({})
        return this.pdfFileRepository.save(newPdfFiles)
    }

    async save(instance: PdfFile): Promise<PdfFile> {
        return this.pdfFileRepository.save(instance)
    }

    async findById(id: string): Promise<PdfFile | null> {
        return this.pdfFileRepository.findOne({
            where: {
                id
            }
        })
    }
    
    async uploadOne(file: Express.Multer.File) {
        try {
            const { originalname, buffer } = file
            
            const originalParsed = path.parse(originalname)
            const uploadPath: string = this.configService.get<string>('UPLOAD_PDF_PATH')
            const uuid: string = uuidv4()
            const filename: string = `${originalParsed.name.trim().replace(/\s/g, '-')}-${uuid}`
            const pathUpload: string = `${uploadPath}/${filename}`
            if (file.mimetype !== 'application/pdf') {
                throw new HttpException('the file is not pdf type', HttpStatus.BAD_REQUEST)
            }
            console.log('test upload 1')
            fs.writeFileSync(pathUpload, file.buffer)
            console.log('test upload 2')
            return filename
            
        } catch (error) {
            console.log(error)
            throw new HttpException(error.response, error.status)
        }
    }

    /*
    ** Upload sponsorshipAgreement pdf
    */
    async uploadPdf(
        file: Express.Multer.File,
        companyId: string,
        projectId: string,
        pdfType: PdfType
    ) {
        try {
            const pdfFiles: PdfFile = await this.pdfFileRepository.findOne({
                where: {
                    contract: {
                        company: {
                            id: companyId
                        },
                        project: {
                            id: projectId
                        }
                    },   
                }
            })
            console.log('pdfFiles', pdfFiles)
            const fileName: string = await this.uploadOne(file)
            console.log('filename', fileName)
            if (pdfType === PdfType.SPONSORSHIP_AGREEMENT) {
                pdfFiles.sponsorshipAgreement = fileName
            } else if (pdfType === PdfType.COMMITMENT_CERITFICATE) {
                pdfFiles.commitmentCertificate = fileName
            } else if (pdfType === PdfType.PLANTATION_REPORT) {
                pdfFiles.plantingReport = fileName
            } else if (pdfType === PdfType.FINANCIAL_REPORT) {
                pdfFiles.financialReport = fileName
            } else if (pdfType === PdfType.PROJECT_SUMMARY) {
                pdfFiles.projectSummary = fileName
            }
            await this.save(pdfFiles)
            console.log('test upload 3')
            return fileName
        } catch (error) {
            console.log(error)
            throw new HttpException(error.response, error.status)
        }
    }

    /*
    ** Download a pdf file
    */
    async getFileStream(filename: string) {
        const path: string = this.configService.get<string>('UPLOAD_PDF_PATH')
        const filePath: string = `${path}/${filename}`
        return fs.createReadStream(filePath)
    }
}