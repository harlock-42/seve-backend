import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ProjectsService from "./projects.service";
import ProjectsController from "./projects.controller";
import { Project } from "./entities/projects.entity";
import ImagesModule from "src/images/images.module";
import { ContractModule } from "src/contracts/contracts.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Project,
		]),
		ImagesModule,
	],
	providers: [
		ProjectsService,
	],
	controllers: [
		ProjectsController,
	],
	exports: [
		ProjectsService
	]
})
export default class ProjectModule {}