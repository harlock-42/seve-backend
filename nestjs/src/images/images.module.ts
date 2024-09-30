import { Module } from "@nestjs/common";
import ImagesController from "./images.controller";
import ImagesService from "./images.service";

@Module({
	imports: [],
	providers: [
		ImagesService
	],
	controllers: [
		ImagesController
	],
	exports: [ImagesService]
})
export default class ImagesModule {}