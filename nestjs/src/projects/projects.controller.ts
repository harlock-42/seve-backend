import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import ProjectsService from "./projects.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Express } from 'express'
import { CreateProjectDto } from "./dtos/createProject.dto";
import { LimitDto } from "./dtos/limit.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { TreeType } from "./types/treeEnum.types";
import { ProductionType } from "./types/productionEnum.types";

@ApiTags('projects')
@Controller('projects')
export default class ProjectsController {
	constructor(
		private projectService: ProjectsService,

	) {}

    @Public()
	@Get('all')
	@ApiOperation({ summary: 'Get all project\'s intances'})
	@ApiOkResponse({ description: 'Request successfull'})
	@ApiBadRequestResponse({ description: 'Bad request'})
	@ApiSecurity('x-api-secret')
	async getAll() {
		return this.projectService.getAll(['contracts'])
	}

	/*
	** Return a defined number of project's intances choose randomly
	*/

    @Public()
	@Get('many')
	@ApiOperation({ summary: 'Get a defined number of instances choose randomly'})
	@ApiQuery({
		name: 'limit',
		required: true,
		type: 'number',
		description: 'Number of instances to retrieve'
	})
	@ApiOkResponse({
		description: 'Random instances retrieved',
		type: [CreateProjectDto]
	})
	@ApiBadRequestResponse({ description: 'Bad request'})
	@ApiSecurity('x-api-secret')
	async getMany(@Query() limitDto: LimitDto) {
		return this.projectService.getMany(limitDto.limit)
	}

	@Public()
	@Get('one')
	@ApiOperation({ summary: 'Get one instance by his id'})
	@ApiQuery({
		name: 'id',
		required: true,
		type: 'string',
		description: 'Instance\'s id'
	})
	@ApiOkResponse({ description: 'The instance has been returned'})
	@ApiSecurity('x-api-secret')
	async getOne(@Query('id') id: string) {
		const project = await this.projectService.getOne(id)
		return project
	}

    @Public()
	@Post('createOne')
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'profileImage', maxCount: 1 },
			{ name: 'images', maxCount: 10 },
			{ name: 'locationPicture', maxCount: 1}
		])
	)
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: "Create a new project and save it in database"})
	@ApiBody({
			description: 'Project data and image files',
			type: CreateProjectDto,
		})
	@ApiOkResponse({ description: "The project is created and saved in database successfully"})
	@ApiBadRequestResponse({ description: "Bad request"})
	@ApiSecurity('x-api-secret')
	async createOne(
		@Body() createProjectDto: CreateProjectDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		const locationPicture = files['locationPicture'][0] || undefined
		const profileImage = files['profileImage'][0] || undefined
		const images = files['images'] || []
		return this.projectService.createProject(createProjectDto, profileImage, images, locationPicture)
	}


    @Public()
	@Delete()
	@ApiOperation({ summary: 'Delete all the project instances and the images associated to them in the file system'})
	async clear() {
		return await this.projectService.clear()
	}
}