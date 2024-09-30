import { ApiProperty } from "@nestjs/swagger";
import { ProductionType } from "../types/productionEnum.types";
import { TreeType } from "../types/treeEnum.types";

export class CreateProjectDto {
	/*
	** Farmer
	*/
	
	@ApiProperty({
		description: 'The name of the farmers',
		example: "Marie Claire"
	})
	name: string

	@ApiProperty({
		description: 'Message from the farmer',
		required: false,
		example: "L'agroforesterie, c'est un équilibre entre les différentes espèces. C'est quelque chose qui est nécessaire à tout système agricole et qui facilite une biodiversité et une production abondante"
	})
	message?: string
	
	@ApiProperty({
		description: 'Wishes from the farmer',
		required: false,
		example: "La création de 4 haies brise-vent pour protéger ses vignes. Ces haies, composées de variétés locales et diversifies, favoriseront aussi le développement de la biodiversité sur la propriété, qui se situe déjà en zone Natura 2000."
	})
	farmerWishes?: string
	
	/*
	** Parcel
	*/
	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'Profile image file',
	})
	profileImage: string

	@ApiProperty({
		description: 'Project\'s description',
		required: false,
		example: "De formation ingénieur agronome, Amandine, vient de reprendre la propriété familiale, que sa famille occupe depuis 4 générations. Passionée par la viticulture, elle souhaite preserver le patrimoine familial et développer un vignoble durable. Cependant, la propriété est soumise à des vents violents, ce qui l\'a convaincue de développer un projet en viti-foresterie."
	})
	parcelDescription: string

	@ApiProperty({
		type: 'array',
		items: {
			type: 'string',
			format: 'binary',
			description: 'Images files',
		}
	})
	images: string[]

	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'Map of france with a pinpoint to locate the project'
	})
	locationPicture: string
	
	@ApiProperty({
		description: 'The types of trees in the parcel.',
		example: Object.values(TreeType),
		type: 'array',
		items: {
			type: 'string'
		}
    })
    treeTypes: string;
	
	@ApiProperty({
		description: 'The number of tree types in the parcel.',
		example: 11
	})
    treeTypeNumber: number;

	@ApiProperty({
		description: 'The number of trees in the parcel to plant.',
		example: 100
	})
    treeNumberGoal: number;

    @ApiProperty({ description: 'The amount of carbon dioxide the trees in the parcel can absorb.', required: false })
    carbonDyoxid: number;
	
	@ApiProperty({
		description: 'total of acres wich have to financed',
		required: false,
		example: 2
	})
	acres?: number
	
	@ApiProperty({
		description: 'The type of production of the parcel.',
		enum: ProductionType,
		type: 'string'
	})
    productionType: ProductionType;


	/*
	** Location
	*/

	@ApiProperty({
		description: 'City of the project',
		required: false,
		example: 'Villecomte'
	})
	city?: string

	@ApiProperty({
		description: 'District of the project',
		example: 'Aveyrons'
	})
	district: string

	@ApiProperty({
		description: 'District\'s number of the project',
		example: 12
	})
	districtNumber: number

	/*
	** Project
	*/

	@ApiProperty({
		description: 'Coast of the project',
		example: 7500
	})
	coast: number

	@ApiProperty({
		description: 'steps of the project to realize', 
		example: ['Etude technique', 'Plants et fournitures', 'Plantation'],
		type: 'array',
		items: {
			type: 'string'
		}
	})
	steps: string
}