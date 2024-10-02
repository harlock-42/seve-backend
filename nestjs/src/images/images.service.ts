import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { writeFile } from "fs";
import * as path from 'path'
import * as sharp from "sharp";
import { v4 as uuidv4 } from 'uuid'
import { promises as fsPromises } from 'fs'
import { unlink } from "fs/promises";


@Injectable()
export default class ImagesService {
	constructor(
		private configService: ConfigService
	) {}

	async uploadOne(file: Express.Multer.File): Promise<string> {
		const { originalname, buffer } = file

		const originalParsed = path.parse(originalname)
		const newExtension: string = '.jpeg'
		const newFilename: string = path.format({
			...originalParsed,
			base: undefined,
			ext: newExtension,
			name: originalParsed.name
		})
		const uploadPath: string = this.configService.get<string>('UPLOAD_FILE_PATH')
		const uuid = uuidv4()
		const filename: string = `${newFilename.trim().replace(/\s/g, '-')}-${uuid}`
		const pathUpload: string = `${uploadPath}/${filename}`

		const jpegBuffer = await sharp(buffer)
			.jpeg({
				quality: 100,
				progressive: true
			})
			.toBuffer()
		writeFile(pathUpload, jpegBuffer, () => {})
		return filename
	}

	async downloadOne(keyfile: string): Promise<Buffer> {
		const imagePath = `${this.configService.get<string>('UPLOAD_FILE_PATH')}/${keyfile}`
		console.log("imagePath", imagePath)
		try {
			const imageBuffer = await fsPromises.readFile(imagePath)
			console.log("imageBuffer", imageBuffer)
			return imageBuffer
		} catch (err) {
			console.error(err)
			return null
		}
	}

	async deleteOne(keyfile: string): Promise<void> {
		try {
			const filePath = `${this.configService.get<string>('UPLOAD_FILE_PATH')}/${keyfile}`
			await unlink(filePath)
		} catch (err) {
			console.error(`${keyfile} not found`)
		}
	}
}