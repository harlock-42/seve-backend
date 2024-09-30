import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProjectDto } from "./dtos/createProject.dto";
import ImagesService from "src/images/images.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./entities/projects.entity";
import { Repository } from "typeorm";
import { ProjectData } from "./intefaces/projectsData.interface";
import { ContractService } from "src/contracts/services/contracts.service";
import { TreeType } from "./types/treeEnum.types";
import { CreateProjectDataType } from "./intefaces/CreateProjectData.interface";

@Injectable()
export default class ProjectsService {
	constructor(
		@InjectRepository(Project)
		private readonly projectRepository: Repository<Project>,
		private imageService: ImagesService,
	) {}

	async getAll(relations: string[] = []): Promise<Project[]> {
		return this.projectRepository.find({
			relations
		})
	}

	/*
	** Return a defined number of project's intances choose randomly
	*/

	async getMany(limit: number): Promise<Project[]> {
		const count: number = await this.projectRepository.count()
		if (limit > count) {
			limit = count
		}

		const randomOffset: number = Math.floor(Math.random() * (count - limit + 1))
		return await this.projectRepository
			.createQueryBuilder('project')
			.offset(randomOffset)
			.limit(limit)
			.getMany()
	}

	/*
	** Find by his id one Project's instance and return it
	*/

	async getOne(id: string): Promise<Project | void> {
		return this.projectRepository.findOne({
			where: {
				id
			},
			relations: {
				contracts: {
					pdfFiles: true,
					company: true,
					newsArr: true
				}
			}
		})
			.then(resolve => resolve)
			.catch((error) => {
				throw new HttpException("Project not found", HttpStatus.NOT_FOUND)
			})
	}

	/*
	** Create a new project instance, save it in database
	** and save images in a volume.
	*/

	async createProject(
		createProjectDto: CreateProjectDto,
		profileImage: Express.Multer.File,
		files: Express.Multer.File[],
		locationPicture: Express.Multer.File
	) {
		const profileKey: string = await this.imageService.uploadOne(profileImage)
		const locationPictureKey: string = await this.imageService.uploadOne(locationPicture)
		const imagesKeyArrayPromises = files.map((file) => {
			return this.imageService.uploadOne(file)
		})
		function convertStringToTreeType(type: string): TreeType | undefined {
			const keys = Object.keys(TreeType) as Array<keyof typeof TreeType>
			for(let key of keys) {
				if (TreeType[key] === type) {
					return TreeType[key]
				}
			}
			return undefined
		}
		let treeTypesArray: TreeType[] = createProjectDto.treeTypes
			.split(',')
			.map(type => type.trim())
			.map(convertStringToTreeType)
			.filter((type): type is TreeType => {
				return type !== undefined
			})
		const imagesKeyArray = await Promise.all(imagesKeyArrayPromises)
		let newProjectData: CreateProjectDataType = {
				name: createProjectDto.name,
				message: createProjectDto.message,
				farmerWishes: createProjectDto.farmerWishes,
				treeTypes: treeTypesArray,
				treeTypeNumber: +createProjectDto.treeTypeNumber,
				treeNumberGoal: +createProjectDto.treeNumberGoal,
				production: createProjectDto.productionType,
				city: createProjectDto.city,
				district: createProjectDto.district,
				districtNumber: +createProjectDto.districtNumber,
				acres: +createProjectDto.acres,
				parcelDescription: createProjectDto.parcelDescription,
				profilePicture: profileKey,
				pictures: imagesKeyArray,
				locationPicture: locationPictureKey,
				coast: +createProjectDto.coast,
				steps: createProjectDto.steps.split(',')
			}
		if (createProjectDto.carbonDyoxid) {
			newProjectData.carbonDyoxid = createProjectDto.carbonDyoxid
		}
		const projectData: ProjectData = this.projectRepository.create(newProjectData)
		return this.projectRepository.save(projectData)
	}

	/*
	** Delete all project's instances from database
	** and their images.
	*/

	async clear(): Promise<void> {
		const projects: ProjectData[] = await this.getAll(["contracts"])

		projects.map((project) => {
			this.imageService.deleteOne(project.profilePicture)
			this.imageService.deleteOne(project.locationPicture)
			project.pictures.map((keyfile) => {
				this.imageService.deleteOne(keyfile)
			})
			this.projectRepository.delete(project.id)
		})
	}
}